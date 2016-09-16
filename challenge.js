$(function(){
  Q.reg('home',function(){
    $('#progress').html('Challenge');
    $('#hint').html('1.在地址栏start后加上"/关数"可跳至已通过关卡<br>2.访问/#!clean可清空关卡进度');
    $('#answer').hide();
    $('#start').show();
    if(!localStorage['userKey']||!localStorage['version']||localStorage['userKey']=='0')
      $.ajax({
        url: 'ajax.php',
        type: 'post',
        data: {
          type:'userKey'
        }
      })
      .done(function(e){
        localStorage['userKey']=e.userKey;
        localStorage['progress']='0';
        localStorage['progressMax']='0';
        localStorage['version']='0';
        localStorage['answer']='';
      })
      .fail(function(){
        alert('LoadFailed');
      });
  });

  Q.reg('start',function(progress){
    if(!localStorage['userKey'])Q.go('home');
    if(progress)jump(progress);
    $('#hint').show();
    $('#answer').show();
    $('#start').hide();
    getHint()
  });

  Q.reg('clean',function(){
    localStorage['userKey']=0;
    Q.go('home');
  });

  Q.init({
    index:'home'
  });

  $('#start').click(function(){
    Q.go('start');
  });

  $('#form').submit(function(){
    localStorage['answer']=$('#answer').val();
    checkAnswer();
    return false;
  });
/*
  $('#answer').keyup(function(){
    localStorage['answer']=$(this).val();
    checkAnswer();
  });
*/
  function jump(progress){
    if(Number(localStorage['progressMax'])>=Number(progress)&&Number(progress)>=0)
      localStorage['progress']=progress;
    Q.go('start');
  }
  function checkAnswer(){
    $.ajax({
      url: 'ajax.php',
      type: 'post',
      data: {
        type:'check',
        userKey:localStorage['userKey'],
        progress:localStorage['progress'],
        answer:localStorage['answer']
      }
    })
    .done(function(e){
      if(e.status==1){
        localStorage['userKey']=e.userKey;
        if(Number(localStorage['progressMax'])==Number(localStorage['progress']))
          localStorage['progressMax']=Number(localStorage['progressMax'])+1;
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
      url: 'ajax.php',
      type: 'post',
      async: false,
      data: {
        type:'get',
        userKey:localStorage['userKey'],
        progress:localStorage['progress']
      },
    })
    .done(function(e){
      if(e.status==1){
        $('#progress').html(localStorage['progress']);
        $('#hint').html(e.hint);
        localStorage['answer']='';
      }
    })
    .fail(function(){
      alert('GetFailed');
    });
  }
});
