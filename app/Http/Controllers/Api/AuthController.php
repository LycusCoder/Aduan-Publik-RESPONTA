<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\VerifyOtpRequest;
use App\Http\Requests\ResendOtpRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;
use Carbon\Carbon;

class AuthController extends Controller
{
    /**
     * Register new user
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        // Create user
        $user = User::create([
            'name' => $validated['name'],
            'no_hp' => $validated['no_hp'],
            'nik' => $validated['nik'],
            'password' => $validated['password'],
            'email' => $validated['email'] ?? null,
        ]);

        // Check if OTP is enabled
        $otpEnabled = config('responta.otp_enabled', false);

        if ($otpEnabled) {
            // Generate and send OTP
            $otp = $this->generateOtp();
            $expiresAt = Carbon::now()->addMinutes(config('responta.otp_expiry_minutes', 5));

            $user->update([
                'otp_code' => $otp,
                'otp_expires_at' => $expiresAt,
            ]);

            // Send OTP via email if email provided
            if ($user->email) {
                try {
                    Mail::to($user->email)->send(new OtpMail($user, $otp));
                } catch (\Exception $e) {
                    \Log::error('Failed to send OTP email: ' . $e->getMessage());
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil! Silakan cek email untuk kode OTP.',
                'data' => [
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'no_hp' => $user->no_hp,
                    'otp_expires_at' => $expiresAt->toDateTimeString(),
                    'requires_verification' => true,
                ],
            ], 201);
        } else {
            // Auto-verify user if OTP is disabled
            $user->update([
                'is_verified' => true,
                'verified_at' => Carbon::now(),
            ]);

            // Create token
            $token = $user->createToken('auth-token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil! Akun Anda sudah terverifikasi.',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'no_hp' => $user->no_hp,
                        'is_verified' => true,
                    ],
                    'token' => $token,
                    'requires_verification' => false,
                ],
            ], 201);
        }
    }

    /**
     * Verify OTP code
     */
    public function verifyOtp(VerifyOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('no_hp', $validated['no_hp'])
            ->where('otp_code', $validated['otp_code'])
            ->where('otp_expires_at', '>', Carbon::now())
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Kode OTP tidak valid atau sudah kadaluarsa.',
            ], 422);
        }

        // Verify user
        $user->update([
            'is_verified' => true,
            'verified_at' => Carbon::now(),
            'otp_code' => null,
            'otp_expires_at' => null,
        ]);

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Verifikasi berhasil! Akun Anda sudah aktif.',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'no_hp' => $user->no_hp,
                    'is_verified' => true,
                ],
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * Resend OTP code
     */
    public function resendOtp(ResendOtpRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('no_hp', $validated['no_hp'])
            ->where('is_verified', false)
            ->first();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'User tidak ditemukan atau sudah terverifikasi.',
            ], 404);
        }

        // Generate new OTP
        $otp = $this->generateOtp();
        $expiresAt = Carbon::now()->addMinutes(config('responta.otp_expiry_minutes', 5));

        $user->update([
            'otp_code' => $otp,
            'otp_expires_at' => $expiresAt,
        ]);

        // Send OTP via email
        if ($user->email) {
            try {
                Mail::to($user->email)->send(new OtpMail($user, $otp));
            } catch (\Exception $e) {
                \Log::error('Failed to send OTP email: ' . $e->getMessage());
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Kode OTP baru telah dikirim ke email Anda.',
            'data' => [
                'otp_expires_at' => $expiresAt->toDateTimeString(),
            ],
        ], 200);
    }

    /**
     * Login user
     */
    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::where('no_hp', $validated['no_hp'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor HP atau password salah.',
            ], 401);
        }

        // Check if user is verified (only if OTP is enabled)
        $otpEnabled = config('responta.otp_enabled', false);
        if ($otpEnabled && !$user->is_verified) {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda belum terverifikasi. Silakan verifikasi OTP terlebih dahulu.',
                'data' => [
                    'requires_verification' => true,
                ],
            ], 403);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil!',
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'no_hp' => $user->no_hp,
                    'is_verified' => $user->is_verified,
                    'total_aduan' => $user->total_aduan,
                    'active_aduan' => $user->active_aduan,
                    'completed_aduan' => $user->completed_aduan,
                ],
                'token' => $token,
            ],
        ], 200);
    }

    /**
     * Logout user
     */
    public function logout(): JsonResponse
    {
        auth()->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil!',
        ], 200);
    }

    /**
     * Generate random OTP code
     */
    private function generateOtp(): string
    {
        $length = config('responta.otp_length', 6);
        return str_pad((string) random_int(0, pow(10, $length) - 1), $length, '0', STR_PAD_LEFT);
    }
}
