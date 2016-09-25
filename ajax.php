<?php
if(!isset($_POST['mod']))exit;

error_reporting(0);

include 'questions.php';

$key = 'haha';
$key = $_SERVER['HTTP_USER_AGENT'].$key.$_SERVER["REMOTE_ADDR"];
$version = 0;

function encrypt($encrypt, $key){
  $iv = mcrypt_create_iv ( mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB ), MCRYPT_RAND );
  $passcrypt = mcrypt_encrypt ( MCRYPT_RIJNDAEL_256, $key, $encrypt, MCRYPT_MODE_ECB, $iv );
  $encode = base64_encode ( $passcrypt );
  return $encode;
}
function decrypt($decrypt, $key){
  $decoded = base64_decode ( $decrypt );
  $iv = mcrypt_create_iv ( mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB ), MCRYPT_RAND );
  $decrypted = rtrim( mcrypt_decrypt ( MCRYPT_RIJNDAEL_256, $key, $decoded, MCRYPT_MODE_ECB, $iv ), "\0");
  return $decrypted;
}

header('Content-Type:application/json');

$ret = [
  'status' => 0
];

switch($_POST['mod']){
  case 'getHint':
    $info = json_decode(decrypt($_POST['key'], $key), true);

    if($info[2]<$version){
      $ret=['status'=>2];
      break;
    }

    $questionPool = $info[0];
    $maxProgress = $info[1];
    $progress = (int)$_POST['progress'];

    if($maxProgress<$progress)break;

    $ret = [
      'status' => 1,
      'hint' => $questions[$questionPool][$progress][0]
    ];
    break;

  case 'checkAnswer':
    //It won't slow down a lot
    $info = json_decode(decrypt($_POST['key'], $key), true);

    if($info[2]<$version){
      $ret=['status'=>2];
      break;
    }

    $questionPool = $info[0];
    $maxProgress = $info[1];
    $progress = (int)$_POST['progress'];
    $answer = $_POST['answer'];

    if(!($progress>=0 && $progress<count($questions[$questionPool])))break;

    if($maxProgress<$progress)break;

    if($questions[$questionPool][$progress][1]===$answer)
      if($maxProgress===$progress)
        $ret = [
          'status' => 1,
          'key' => encrypt(json_encode([$questionPool, $progress+1, $version]), $key)
        ];
      else
        $ret = [
          'status' => 1,
          'key' => $_POST['key']
        ];
    break;

  case 'getKey':
    if(isset($_POST['questionPool'], $questions[$_POST['questionPool']]))
      $questionPool = $_POST['questionPool'];
    else
      $questionPool = 'default';

    $ret = [
      'status' => 1,
      'key' => encrypt(json_encode([$questionPool, 0, $version]), $key)
    ];
    break;
}

echo json_encode($ret);
