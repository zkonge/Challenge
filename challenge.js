$(function(){
  Q.reg('home',function(){
    $('#progress').html('Challenge');
    $('#hint').html('1.在地址栏start后加上"/#!start/关卡数"可跳至已通过关卡<br>2.访问/#!clean可清空关卡进度<br>2.访问"/#!change/题库名"可更改题库(进度清空)');
    $('#answer').hide();
    $('#start').show();
    if(!localStorage['Key'])
      $.ajax({
        url:'ajax.php',
        type:'post',
        data:{
          mod:'getKey'
        }
      })
      .done(function(e){
        localStorage['Key']=e.key;
        localStorage['progress']='0';
        localStorage['maxProgress']='0';
      })
      .fail(function(){
        alert('LoadFailed');
      });
  });

  Q.reg('start',function(progress){
    if(!localStorage['Key'])Q.go('home');
    if(progress)jump(progress);
    $('#hint').show();
    $('#answer').show();
    $('#start').hide();
    getHint()
  });

  Q.reg('change',function(questionPool){
    localStorage.clear();
    $.ajax({
      url:'ajax.php',
      type:'post',
      data:{
        mod:'getKey',
        questionPool:questionPool
      }
    })
    .done(function(e){
      localStorage['Key']=e.key;
      localStorage['progress']='0';
      localStorage['maxProgress']='0';
    })
    .fail(function(){
      alert('ChangeFailed');
    })
    .always(function(){
      Q.go('home')
    });
  });

  Q.reg('clean',function(){
    localStorage.clear();
    Q.go('home');
  });

  Q.init({
    index:'home'
  });

  $('#start').click(function(){
    Q.go('start');
  });

  $('#form').submit(function(){
    checkAnswer($('#answer').val());
    return false;
  });

/*
  $('#answer').keyup(function(){
    checkAnswer($(this).val());
  });
*/

  function jump(progress){
    if(Number(localStorage['maxProgress'])>=Number(progress)&&Number(progress)>=0)
      localStorage['progress']=progress;
    Q.go('start');
  }

  function checkAnswer(answer){
    $.ajax({
      url:'ajax.php',
      type:'post',
      data:{
        mod:'checkAnswer',
        key:localStorage['Key'],
        progress:localStorage['progress'],
        answer:answer
      }
    })
    .done(function(e){
      if(e.status==1){
        localStorage['Key']=e.key;
        if(Number(localStorage['maxProgress'])==Number(localStorage['progress']))
          localStorage['maxProgress']=Number(localStorage['maxProgress'])+1;
        localStorage['progress']=Number(localStorage['progress'])+1;
        $('#answer').val('');
        getHint();
      }else{
        $('#answer').addClass('error');
      }
    })
    .fail(function(){
      alert('CheckFailed');
    });
  }

  function getHint(){
    $('#answer').removeClass('error');
    $.ajax({
      url:'ajax.php',
      type:'post',
      async:false,
      data:{
        mod:'getHint',
        key:localStorage['Key'],
        progress:localStorage['progress']
      },
    })
    .done(function(e){
      if(e.status==2){
        alert('Version updated');
        localStorage.clear();
        Q.go('home');
      }else if(e.status==1){
        $('#progress').html(localStorage['progress']);
        $('#hint').html(e.hint);
      }
    })
    .fail(function(){
      alert('GetFailed');
    });
  }
});
