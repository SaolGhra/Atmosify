<!DOCTYPE html>
<html lang="en">

    <head>

        <?php include('html/head.html'); ?>

    </head>

    <body>

        <?php include('mobile/mobilenav.html'); ?>
        <?php include('html/sidebar.html'); ?>

        <div id="particles-js"></div>

        <div class="wrapper">

            <div class="main-content">
                <div class="weather-flex-container">
                    <?php include('html/weather.html'); ?>
                </div>
                <div class="inspirational-news-flex-container">
                    <?php include('html/inspirational.html'); ?>
                    <?php include('html/news.html'); ?>
                </div>
                <div class="stocks-flex-container">
                    <?php include('html/stocks.html'); ?>
                </div>
            </div>

        </div>

        <footer>

            <?php include('html/footer.html'); ?>

        </footer>

        <!-- JavaScript Scripts -->
        <?php include('html/scripts.html'); ?>
        
    </body>

</html>