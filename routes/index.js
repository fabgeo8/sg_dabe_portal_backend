var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.json({'message': 'ok'});
});

router.get('/kml/:xcoord/:ycoord', function (req, res) {
    res.set({"Content-Disposition":"attachment; filename=\"marker.kml\", 'Content-type': 'text/xml'"});
    res.send('<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/kml/2.2 https://developers.google.com/kml/schema/kml22gx.xsd"><Document><name>Zeichnung</name><Placemark id="marker_1629102680017"><ExtendedData><Data name="type"><value>marker</value></Data></ExtendedData><name></name><description></description><Style><IconStyle><Icon><href>https://api3.geo.admin.ch/color/255,69,0/marker-24@2x.png</href><gx:w>48</gx:w><gx:h>48</gx:h></Icon><hotSpot x="24" y="4.799999999999997" xunits="pixels" yunits="pixels"/></IconStyle></Style><Point><tessellate>1</tessellate><altitudeMode>clampToGround</altitudeMode><coordinates>' + req.params.xcoord + ',' + req.params.ycoord + '</coordinates></Point></Placemark></Document></kml>')
});


module.exports = router;