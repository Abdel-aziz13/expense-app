<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérification Email - {{ config('app.name') }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            min-height: 100vh;
            padding: 40px 20px;
        }

        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .header {
            background: linear-gradient(135deg, #009639 0%, #ce1126 100%);
            padding: 50px 40px;
            text-align: center;
            position: relative;
        }

        .star {
            position: absolute;
            top: 20px;
            right: 30px;
            color: #fcdd09;
            font-size: 32px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .logo {
            color: #fcdd09;
            font-size: 36px;
            font-weight: 700;
            letter-spacing: -1px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .app-subtitle {
            color: #ffffff;
            font-size: 14px;
            margin-top: 8px;
            opacity: 0.9;
            font-weight: 500;
        }

        .content {
            padding: 30px;
        }

        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 30px;
            font-weight: 500;
        }

        .instruction {
            font-size: 16px;
            color: #666;
            margin-bottom: 10px;
            line-height: 1.5;
        }

        .code-container {
            background: linear-gradient(135deg, #009639 0%, #ce1126 100%);
            padding: 30px;
            text-align: center;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
        }

        .code-container::before {
            content: "★";
            position: absolute;
            top: 10px;
            right: 15px;
            color: #fcdd09;
            font-size: 20px;
            opacity: 0.8;
        }

        .verification-code {
            font-size: 48px;
            font-weight: 700;
            color: #fcdd09;
            font-family: 'Courier New', monospace;
            letter-spacing: 4px;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .help-section {
            display: flex;
            align-items: flex-start;
            gap: 20px;
            margin-top: 40px;
            padding: 25px;
            border-top: 1px solid #070807;
            border-bottom: 1px solid #070807;
        }

        .help-icon {
            width: 80px;
            height: 60px;
            background: linear-gradient(135deg, #fcdd09 0%, #ffd700 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            flex-shrink: 0;
            border: 2px solid #009639;
        }

        .help-text {
            flex: 1;
        }

        .help-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 12px;
        }

        .help-description {
            font-size: 14px;
            color: #666;
            line-height: 1.6;
        }

        .faq-link {
            color: #009639;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s ease;
        }

        .faq-link:hover {
            border-bottom-color: #009639;
        }

        .community-link {
            color: #ce1126;
            text-decoration: none;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: border-color 0.3s ease;
        }

        .community-link:hover {
            border-bottom-color: #ce1126;
        }

        .footer-info {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            border-top: 1px solid #e9ecef;
        }

        .cameroon-flag {
            display: inline-flex;
            margin: 0 5px;
            vertical-align: middle;
        }

        .flag-stripe {
            width: 8px;
            height: 12px;
        }

        .green {
            background-color: #009639;
        }

        .red {
            background-color: #ce1126;
        }

        .yellow {
            background-color: #fcdd09;
        }

        .red {
            background-color: #ce1126;
            position: relative;
        }

        .red::after {
            content: "★";
            position: absolute;
            color: #fcdd09;
            font-size: 8px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        @media (max-width: 480px) {
            .header {
                padding: 40px 20px;
            }

            .logo {
                font-size: 28px;
            }

            .content {
                padding: 30px 20px;
            }

            .verification-code {
                font-size: 36px;
                letter-spacing: 2px;
            }

            .help-section {
                flex-direction: column;
                gap: 15px;
                padding: 20px;
            }

            .help-icon {
                width: 60px;
                height: 45px;
                font-size: 20px;
            }

            .star {
                top: 15px;
                right: 20px;
                font-size: 24px;
            }
        }
    </style>
</head>

<body>
    <div class="email-container">
        <div class="header">
            <div class="star">★</div>
            <div class="logo">{{ env('APP_NAME') }}</div>
            <div class="app-subtitle">Suivi de dépenses quotidiennes</div>
        </div>

        <div class="content">
            <div class="greeting">
                Bonjour {{ $data['name'] }},
            </div>

            <div class="instruction">
                Veuillez saisir le code ci-dessous pour vérifier votre adresse e-mail :
            </div>

            <div class="code-container">
                <div class="verification-code">{{ $data['code'] }}</div>
            </div>

            <div class="help-section">
                <div class="help-icon">💰</div>
                <div class="help-text">
                    <div class="help-title">Besoin d'aide ? Nous sommes là pour vous !</div>
                    <div class="help-description">
                        Consultez notre <a href="#" class="faq-link">FAQ</a> ou posez vos questions sur la <a
                            href="#" class="community-link">communauté</a>
                        MonBudget. Vous pouvez également nous contacter via WhatsApp ou nos réseaux sociaux.
                    </div>
                </div>
            </div>
        </div>

        <div class="footer-info">
            Fait avec ❤️ au Cameroun
            <div class="cameroon-flag">
                <div class="flag-stripe green"></div>
                <div class="flag-stripe red"></div>
                <div class="flag-stripe yellow"></div>
            </div>
            pour les Camerounais
        </div>
    </div>
</body>

</html>
