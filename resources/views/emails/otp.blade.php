<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kode OTP RESPONTA</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .content {
            padding: 40px 30px;
        }
        .greeting {
            font-size: 18px;
            color: #333333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #555555;
            line-height: 1.6;
            margin-bottom: 30px;
        }
        .otp-box {
            background-color: #f8f9fa;
            border: 2px dashed #667eea;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
        }
        .otp-label {
            font-size: 14px;
            color: #666666;
            margin-bottom: 10px;
        }
        .otp-code {
            font-size: 36px;
            font-weight: 700;
            color: #667eea;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
        }
        .expiry {
            font-size: 14px;
            color: #999999;
            margin-top: 10px;
        }
        .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #856404;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999999;
        }
        .footer a {
            color: #667eea;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ RESPONTA</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Sistem Pelaporan Aduan Warga</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Halo, <strong>{{ $userName }}</strong>! 👋
            </div>
            
            <div class="message">
                Terima kasih telah mendaftar di <strong>RESPONTA</strong>. Untuk menyelesaikan proses registrasi, silakan masukkan kode OTP berikut:
            </div>
            
            <div class="otp-box">
                <div class="otp-label">Kode Verifikasi OTP</div>
                <div class="otp-code">{{ $otpCode }}</div>
                <div class="expiry">⏰ Berlaku selama {{ $expiryMinutes }} menit</div>
            </div>
            
            <div class="warning">
                <strong>⚠️ Perhatian:</strong><br>
                • Jangan bagikan kode OTP ini kepada siapapun<br>
                • Tim RESPONTA tidak akan pernah meminta kode OTP Anda<br>
                • Kode ini hanya berlaku untuk satu kali penggunaan
            </div>
            
            <div class="message">
                Jika Anda tidak merasa melakukan registrasi, abaikan email ini atau hubungi tim support kami.
            </div>
        </div>
        
        <div class="footer">
            <p>Email ini dikirim secara otomatis. Mohon tidak membalas email ini.</p>
            <p>&copy; 2025 RESPONTA. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
