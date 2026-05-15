async function searchShop() {
    const input = document.getElementById("searchInput").value.trim().toLowerCase();

    if(!input){
        alert("Enter a valid shop name.");
        return;
    }

    try {
        fetch(`/api/search_shops.php?keyword=${encodeURIComponent(input)}`);
        const data = await response.json();

        console.log(data);

        if (data.count === 0) {
            alert("No shops found.");
            return;
        }

        displayShops(data.data);
        
    } catch (error) {
        console.error(error);
        alert("Something went wrong while searching.");
    }

}