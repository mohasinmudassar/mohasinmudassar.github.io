$(document).ready(function(){
$('.slider').slick({
    arrows:false,
    dots:true,
    appendDots:'.slider-dots',
    dotsClass:'dots'
});


let hamberger = document.querySelector('.hamberger');
let times = document.querySelector('.times');
let close1 = document.querySelector('.closeNow1');
let close2 = document.querySelector('.closeNow2');
let close3 = document.querySelector('.closeNow3');
let close4 = document.querySelector('.closeNow4');
let close5 = document.querySelector('.closeNow5');
let mobileNav = document.querySelector('.mobile-nav');

hamberger.addEventListener('click', function(){
  mobileNav.classList.add('open');  
});

times.addEventListener('click', function(){
    mobileNav.classList.remove('open');  
});

close1.addEventListener('click', function(){
  mobileNav.classList.remove('open');  
});
close2.addEventListener('click', function(){
  mobileNav.classList.remove('open');  
});
close3.addEventListener('click', function(){
  mobileNav.classList.remove('open');  
});
close4.addEventListener('click', function(){
  mobileNav.classList.remove('open');  
});
close5.addEventListener('click', function(){
  mobileNav.classList.remove('open');  
});

});