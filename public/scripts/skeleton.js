// Code to do a jQuery snippet is adapted from a COMP 1537 assignment and COMP 1800 demo.
"use strict";
function loadSkeleton(){
    console.log($('#navPlaceholder').load('/html/nav.html'));
    console.log($('#footerPlaceholder').load('/html/footer.html'));
}
loadSkeleton();