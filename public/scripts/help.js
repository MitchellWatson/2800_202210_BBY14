let coll = document.getElementsByClassName("collapsible");
let i;

// Code addapted from https://www.w3schools.com/howto/howto_js_collapsible.asp

// Collapsible for Help page
for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}