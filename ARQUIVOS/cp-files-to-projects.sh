
mkdir -p /www/INFRACOMMERCE/rayban/rb/htdocs/{css,js,images,fonts}/ifc-easy-checkout-0.0.1;
mkdir -p /www/INFRACOMMERCE/rayban/rb/htdocs/js/ifc-vendors-0.0.1;
mkdir -p /www/INFRACOMMERCE/rayban/rb/htdocs/js/ifc-events-0.0.1;

cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/css/* /www/INFRACOMMERCE/rayban/rb/htdocs/css/;
cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/js/* /www/INFRACOMMERCE/rayban/rb/htdocs/js/;
cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/images/* /www/INFRACOMMERCE/rayban/rb/htdocs/images/;
cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/fonts/* /www/INFRACOMMERCE/rayban/rb/htdocs/fonts/;

cp -Rfv /www/INFRACOMMERCE/ifc-vendors/build/htdocs/js/* /www/INFRACOMMERCE/rayban/rb/htdocs/js/;
cp -Rfv /www/INFRACOMMERCE/ifc-events/build/htdocs/js/* /www/INFRACOMMERCE/rayban/rb/htdocs/js/;

cp -Rfv /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/css/easy-checkout-custom.css /www/INFRACOMMERCE/rayban/rb/htdocs/css/easy-checkout-custom.css;


cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/css/* /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/css/;
cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/js/* /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/js/;
cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/images/* /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/images/;
cp -Rfv /www/INFRACOMMERCE/ifc-easy-checkout/build/htdocs/fonts/* /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/fonts/;

cp -Rfv /www/INFRACOMMERCE/ifc-vendors/build/htdocs/js/* /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/js/;
cp -Rfv /www/INFRACOMMERCE/ifc-events/build/htdocs/js/* /www/INFRACOMMERCE/conceitofirmacasa/cfmc/htdocs/js/;
