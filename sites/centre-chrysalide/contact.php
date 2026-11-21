<?php
/* Centre Chrysalide – traitement du formulaire de contact (hébergement PHP / cPanel).
   Ne stocke aucune donnée : envoie uniquement un e-mail au secrétariat. */
declare(strict_types=1);

const TO      = 'info@centrechrysalide.be';
const FROM    = 'no-reply@centrechrysalide.be'; // doit exister ou être autorisé sur le domaine (SPF)
const SUBJECT = 'Nouvelle demande de rendez-vous – site web';

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');
function done(bool $ok, string $err = ''): never {
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($ok ? 200 : 400);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'error' => $err]);
    } else {
        header('Location: index.html?envoi=' . ($ok ? 'ok' : 'erreur') . '#rdv');
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') done(false, 'Méthode non autorisée');
if (!empty($_POST['website'])) done(true); // pot de miel anti-spam

// Limitation simple : 1 envoi / 30 s par session
session_start();
if (isset($_SESSION['last']) && time() - $_SESSION['last'] < 30) done(false, 'Merci de patienter quelques secondes.');

$clean = fn(string $k, int $max = 200) => trim(mb_substr(str_replace(["\r", "\n"], ' ', (string)($_POST[$k] ?? '')), 0, $max));
$nom   = $clean('nom');
$tel   = $clean('tel', 40);
$email = $clean('email', 120);
$disc  = $clean('discipline', 40);
$age   = $clean('age', 20);
$msg   = trim(mb_substr((string)($_POST['message'] ?? ''), 0, 3000));

if ($nom === '' || $tel === '' || $msg === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($_POST['rgpd'])) {
    done(false, 'Champs obligatoires manquants ou e-mail invalide.');
}

$body = "Nouvelle demande via le site\n\n"
      . "Nom : $nom\nTéléphone : $tel\nE-mail : $email\n"
      . "Discipline : " . ($disc ?: 'non précisée') . "\nÂge du patient : " . ($age ?: '-') . "\n\n"
      . "Message :\n$msg\n";

$headers = [
    'From: Centre Chrysalide (site) <' . FROM . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP',
];
$ok = mail(TO, '=?UTF-8?B?' . base64_encode(SUBJECT) . '?=', $body, implode("\r\n", $headers), '-f' . FROM);
if ($ok) $_SESSION['last'] = time();
done($ok, $ok ? '' : 'Envoi impossible');
