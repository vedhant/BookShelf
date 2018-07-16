Form = document.querySelector('form');
usernames = document.querySelector('#usernames').innerHTML;
usernames = usernames.split(',');
var exist = false;
document.querySelectorAll('.auth li')[1].querySelector('a').classList.add('active');

Form.addEventListener('submit', function(e) {
  const details = Form.querySelectorAll('input');
  if(details[2].value != details[3].value){
    e.preventDefault();
    alert('passwords do not match!');
  }
  if(exist){
    e.preventDefault();
  }
});


username_input = Form.querySelector('input');
username_input.addEventListener('keyup', function(e) {
  name = e.target.value;
  var out = false
  usernames.forEach(function(username) {
    if(username == name || out){
      username_input.style.borderTop = '2px solid red';
      username_input.style.borderBottom = '2px solid red';
      username_input.style.borderLeft = '2px solid red';
      username_input.style.borderRight = '2px solid red';
      out = true;
    }else{
      username_input.style.borderTop = '2px solid green';
      username_input.style.borderBottom = '2px solid green';
      username_input.style.borderRight = '2px solid green';
      username_input.style.borderLeft = '2px solid green';
    }
  });
  if(out){
    exist = true;
  }
  else{
    exist = false;
  }
});
