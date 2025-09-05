<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <title>Réinitialisation du mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background: #f9fafb;
            color: #333;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            padding: 30px;
        }

        .header {
            text-align: center;
            background: linear-gradient(90deg, #007A5E, #CE1126, #FCD116);
            /* vert, rouge, jaune */
            color: white;
            padding: 15px;
            border-radius: 12px 12px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 20px;
        }

        .content {
            padding: 20px;
            line-height: 1.6;
            font-size: 15px;
        }

        .code-box {
            background: #f0fdf4;
            border: 2px solid #22c55e;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            color: #16a34a;
        }

        .button {
            display: inline-block;
            background: #FCD116;
            /* jaune */
            color: #111;
            text-decoration: none;
            font-weight: bold;
            padding: 12px 24px;
            border-radius: 6px;
            margin-top: 20px;
        }

        .footer {
            text-align: center;
            font-size: 13px;
            color: #666;
            margin-top: 30px;
        }
    </style>
</head>

<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>🔑 Réinitialisation du mot de passe</h1>
        </div>

        <!-- Contenu -->
        <div class="content">
            <p>Bonjour <strong>{{ $data['name'] }}</strong>,</p>

            <p>Vous avez demandé à réinitialiser votre mot de passe pour votre compte
                <strong>FinTrack237</strong>.
            </p>

            <p>✨ Voici votre code de vérification :</p>
            <div class="code-box">
                {{ $data['code'] }}
            </div>

            <p>⏳ Ce code est valable <strong>15 minutes</strong>.</p>

            <p>Si vous n’avez pas demandé cette réinitialisation, ignorez simplement ce message.</p>

            {{-- <div style="text-align:center;">
                <a href="{{ config('app.url') }}" class="button">Aller sur FinTrack237</a>
            </div> --}}
        </div>

        <!-- Footer -->
        <div class="footer">
            Merci,<br>
            L’équipe <strong>FinTrack237</strong> 🚀
        </div>
    </div>
</body>

</html>
