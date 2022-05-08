// "use strict";
function loadSkeleton(){
    console.log($('#navPlaceholder').load('/html/nav.html'));
    console.log($('#footerPlaceholder').load('/html/footer.html'));
}
loadSkeleton();