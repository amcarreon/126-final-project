
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <title>Shop Profile</title>
    </head>
    <body>
        <div class="shopProfile" id="shopProfileID">
            <form class="shopProfileForm" id="shopProfileFormID" action="../../api/shopInfo_form.php" method="post" enctype="multipart/form-data">

                <input type="file" id="photoUpload" name="photoUpload" style="display: none;" required>

                <h1>Store Profile Picture</h1>

                <div class="imgDiv">
                    <label for="photoUpload" class="customUpload">Upload Image</label>
                </div>
                
                <br><br>

                <div class="nameDiv">
                    <input type="text" id="shopName" name="shopName" placeholder="Shop Name">
                </div>
                <div class="descriptionDiv">
                    <input type="text" id="shopDescription" name="shopDescription" placeholder="Shop Description">
                </div>

                <input type="tel" id="contactInfo" name="contactInfo" placeholder="Contact Information">
            
                <div class="socialMediaDiv">
                    <select id="socialMediaPlatform" name="socialMediaPlatform">
                        <option value="">Select Platform</option>
                        <option value="facebook">Facebook</option>
                        <option value="instagram">Instagram</option>
                    </select>
                    <input type="text" id="socialMediaLink" name="socialMediaLink" placeholder="Social Media Link">
                </div>

                <input type="text" id="location" name="location" placeholder="Location">
                <button type="submit" class="submit">Save</button>
                <button type="button" id="cancelEdit">Cancel</button>
            </form>
        </div>

    <script src="../../assets/js/shopInfo_form.js"></script>
            
</body>
</html>