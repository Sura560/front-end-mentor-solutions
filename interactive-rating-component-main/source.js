const card = document.getElementById("card")

const btn = document.getElementsByTagName("button");
const button = document.getElementById("btn")
 button.addEventListener('click', function(){
   console.log(button.value)
 })
   
 function clicked(){
   let str = rating();
    console.log(str)
    console.log('clicked')
 }

       function submit(){
     card.innerHTML = `
  <div class="card-rate">
     <img src="images/illustration-thank-you.svg" alt="">
        <div class="rate-value">
           <p>You selected  out of 5</p>
        </div>
      <h1> Thank you!</h1>
      <p>We appreciate you taking the time to give a rating. If you ever need more support, 
        don’t hesitate to get in touch!</p>
 </div>
    
    
    `
   
   }
  
   
   

    