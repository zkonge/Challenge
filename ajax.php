<?php
if(!isset($_POST['type']))exit;

error_reporting(0);

include 'questions.php';

//$_SERVER['HTTP_USER_AGENT']=$_SERVER['HTTP_CF_CONNECTING_IP'];

$key='haha';
$key=$_SERVER['HTTP_USER_AGENT'].$key;

function check($progress){
  global $questions;
  if(is_int($progress)&&$progress>=0&&$progress<count($questions))return true;
  return false;
}
function compare($progress,$answer){
  global $questions;
  if(check($progress)&&$questions[$progress][1]===$answer)return true;
  return false;
}
function get($progress){
  global $questions;
  if(check($progress))return $questions[$progress][0];
  return false;
}

function encrypt($encrypt,$key) {
 $key = dechex(crc32($key));
 $iv = mcrypt_create_iv ( mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB ), MCRYPT_RAND );
 $passcrypt = mcrypt_encrypt ( MCRYPT_RIJNDAEL_256, $key, $encrypt, MCRYPT_MODE_ECB, $iv );
 $encode = base64_encode ( $passcrypt );
 return $encode;
}

function decrypt($decrypt,$key) {
 $key=dechex(crc32($key));
 $decoded = base64_decode ( $decrypt );
 $iv = mcrypt_create_iv ( mcrypt_get_iv_size ( MCRYPT_RIJNDAEL_256, MCRYPT_MODE_ECB ), MCRYPT_RAND );
 $decrypted = rtrim( mcrypt_decrypt ( MCRYPT_RIJNDAEL_256, $key, $decoded, MCRYPT_MODE_ECB, $iv ), "\0");
 return $decrypted;
}

header('Content-Type:application/json');

$ret=['status'=>0];

switch($_POST['type']){
  case 'userKey':
    $ret=[
      'status'=>1,
      'userKey'=>encrypt('0',$key)
    ];
    break;

  case 'check':
    if(!isset($_POST['userKey']))break;
    $realProgress=(int)decrypt($_POST['userKey'],$key);
    if($realProgress<(int)$_POST['progress'])break;
    if(compare((int)$_POST['progress'],$_POST['answer']))
      if($realProgress===(int)$_POST['progress']){
        $ret=[
          'status'=>1,
          'userKey'=>encrypt((int)$_POST['progress']+1,$key)
        ];
      }else{
        $ret=[
          'status'=>1,
          'userKey'=>$_POST['userKey']
        ];
      }
    break;

  case 'get':
    if(!isset($_POST['userKey']))break;
    $realProgress=(int)decrypt($_POST['userKey'],$key);
    if($realProgress<(int)$_POST['progress'])break;
    $ret=[
      'status'=>1,
      'progress'=>$_POST['progress'],
      'hint'=>get((int)$_POST['progress'])
    ];
    break;

}

echo json_encode($ret);
