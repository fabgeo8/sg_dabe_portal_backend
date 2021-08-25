const express = require('express');
const router = express.Router();
const models = require('../models')
const {Op} = require("sequelize");
const moment = require('moment');
const pdf = require('pdf-creator-node');
const fs = require('fs');

router.post('/', async (req, res) => {
    try {
        let pvApplication = await models.PvApplication.build({
            egid: req.body.egid,
            object_street: req.body.object_street,
            object_streetnumber: req.body.object_streetnumber,
            object_zip: req.body.object_zip,
            object_city: req.body.object_city,
            object_plot: req.body.object_plot,
            generator_area: req.body.generator_area,
            contact_name: req.body.contact_name,
            contact_phone: req.body.contact_phone,
            contact_email: req.body.contact_email,
            builder_street: req.body.builder_street,
            builder_location: req.body.builder_location,
            builder_name: req.body.builder_name
        })

        //todo replace moment.js
        let identifier = moment().format('YYMMDD') + '_' + req.body.egid;

        let date = new Date()
        date.setHours(0, 0, 0, 0)

        //check if an application for this address has already been made on this day
        let previousVersion = await models.PvApplication.findAll({
            where: {
                object_street: pvApplication.object_street,
                object_streetnumber: pvApplication.object_streetnumber,
                object_zip: pvApplication.object_zip,
                createdAt: {
                    [Op.gte]: date
                }
            },
            order: [
                ['version', 'DESC']
            ]
        })

        if (previousVersion.length > 0) {
            // there are previous version for same address
            // get highest version number of previous versions
            pvApplication.version = previousVersion[0].version + 1
        } else {
            // first version
            pvApplication.version = 1
        }

        // assign identifier to application
        identifier = identifier + '_' + pvApplication.version
        pvApplication.identifier = identifier

        // get municipal id and check if municipal is available in municipal table
        // this is important to have reference for municipal contact email
        let municipal = await models.Muncipal.findByPk(req.body.municipal);

        if (municipal) {
            pvApplication.municipal = req.body.municipal
        } else {
            res.status(404).send({error: 'invalid municipal'})
            return
        }

        await pvApplication.save()

        res.status(200).send("created")
    } catch (err) {
        res.status(404).send({error: "event could not be created"})
    }
})

router.get('/:id/pdf2', async (req, res) => {
    const fs = require("fs");
    const path = require("path");
    const puppeteer = require('puppeteer');
    const handlebars = require("handlebars");

    const data = {
        /*title: "A new Brazilian School",
        date: "05/12/2018",
        name: "Rodolfo Luis Marcos",
        age: 28,
        birthdate: "12/07/1990",
        course: "Computer Science",
        obs: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce."*/
    }

    var templateHtml = fs.readFileSync(path.join(process.cwd(), 'templates/pv_application.html'), 'utf8');
    var template = handlebars.compile(templateHtml);
    // var html = template(data);
    var html = `
    <!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Hello world!</title>

    <style>
        body {

            font-family: Arial;
            font-size: 11px;
            padding: 0;
            margin: 0;
        }

        h1 {
            font-family: Arial;
            font-size: 18px;
        }

        h2 {
            font-size: 12px;
        }

        p {
            font-size: 10px;
        }

        p.small {
            font-size: 8px;
        }

        p.footer {
            font-size: 9px;

        }

        p.bold {
            font-weight: bold;
        }

        input {
            border: none;
            border-bottom: 1px solid black;

            /*background: linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0)), linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0)), linear-gradient(rgb(0, 0, 0), rgb(0, 0, 0));*/
            /*background-size: 1px 50%, 100% 1px, 1px 0%;*/
            /*background-position: bottom left, bottom center, bottom right;*/
            /*background-repeat: no-repeat;*/
        }

        table td {
            padding-right: 10px;
        }

        table td input {
            width: 100%;
            display: block;
            background-color: rgb(222, 229, 255);
        }

        table td.double input {
            width: 100%;
        }

        table {
            width: 100%;
        }

        .wrapper {
            position: relative;
            width: 100%;
        }



    </style>
</head>
<body>
<div class="wrapper">
    <!--    <img src="sg_logo.png" style="position: absolute; top: 0; right: 0; height: 18px">-->

    <p>Kanton St. Gallen<br>
        Baudepartement</p>
    <p class="bold">Amt für Wasser und Energie</p>
    <h1>PV-Ersatzabgabe-Rechner: Erklärung</h1>
    <p>für die Entrichtung einer Ersatzabgabe nach Art.5c des Energiegesetzes.</p>
    <p style="font-size: 7pt">Neubauten erzeugen einen Teil der von ihnen benötigten Elektrizität selber oder haben
        einen
        gewichteten
        Energiebedarf für Heizung, Warmwasser, Lüftung und Klimatisierung, der um 5kWh je m² beheizte Fläche und Jahr
        verringert ist. Hauseigentümerinnen und Hauseigentümer, die auf die Eigenstromerzeugung oder die Verringerung
        des
        gewichteten
        Energiebedarfs verzichten, entrichten dem Kanton eine Ersatzabgabe. Die Ersatzabgabe beträgt Fr.2’700.–
        je kWp der für die Neubaute nach Art.4c Abs.1 der Energieverordnung (sGS 741.11; abgekürzt EnV) zu erstellenden
        Anlage. Sie wird mit den Baubewilligungsgebühren erhoben. Ausgenommen sind kleinere Erweiterungen bestehender
        Bauten (siehe Ausnahmen nach Art.4d EnV).</p>
    <h2>A. Angaben zum Gebäude</h2>
    <table>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Gemeinde</label>
            </td>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Gemeinde</label>
            </td>
        </tr>
    </table>

    <p class="bold">Bauvorhaben, Objekt</p>
    <br>
    <table>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Strasse</label>
            </td>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Hausnummer</label>
            </td>
        </tr>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>PLZ</label>
            </td>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Ort</label>
            </td>
        </tr>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Parzelle</label>
            </td>
            <td>
            </td>
        </tr>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Eidg. Gebäudeidentifikator</label>
            </td>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Energiebezugsfläche in m&sup2;</label>
            </td>
        </tr>
    </table>
    <br>
    <p class="bold">Bauherrschaft</p>

    <table>
        <tr>
            <td class="double">
                <input type="text" value="St. Gallen"/>
                <label>Name, Vorname</label>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Strasse, Nr.</label>
            </td>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>PLZ, Ort</label>
            </td>
        </tr>
    </table>

    <br>
    <p class="bold">Kontaktperson</p>

    <table>
        <tr>
            <td class="double">
                <input type="text" value="St. Gallen"/>
                <label>Name, Vorname</label>
            </td>
        </tr>
    </table>
    <table>
        <tr>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>Telefon</label>
            </td>
            <td>
                <input type="text" value="St. Gallen"/>
                <label>E-Mail</label>
            </td>
        </tr>
    </table>

    <p style="margin-top: 4cm"><b>
        Amt für Wasser und Energie AWE
    </b><br>
        Lämmlisbrunnenstrasse 54, 9001 St.Gallen, Telefon 058 229 30 99, info.awe@sg.ch<br>
        Deklaration Ersatzabgabe / 17.5.2021
    </p>

    <span style="position: absolute; top: 27cm; right: 0">
    <b>1 / 2</b>
</span>

    <h2>Berechnung Ersatzabgabe</h2>
    <p>
        Die Ersatzabgabe berechnet sich wie folgt:
    </p>
    <p>
    <ul style="padding-left: 1em">
        <li>Energiebezugsfläche (abgekürzt EBF) kleiner als 3'000m&sup2;:</li>
        <li style="margin-top: 8pt; list-style: none; text-indent: 2em">Ersatzabgabe (in Fr.) = EBF (in m&sup2;) * 0.01
            kWp/m&sup2; * 2'700 Franken/kWp
        </li>
    </ul>
    </p>
    <p>
    <ul style="padding-left: 1em">
        <li>Energiebezugsfläche 3'000 m² oder mehr (die Obergrenze gem. Art. 4c Bst. b beträgt 30 kW je Baute und wird
            mit
            3'000m² erreicht):
        </li>
        <li style="margin-top: 8pt; list-style: none; text-indent: 2em">Ersatzabgabe = 81'000 Franken</li>
    </ul>
    </p>
    <p>
        Diese Erklärung hält gestützt auf Art.5c Abs.1 EnG i.V.m. Art.4e der EnV, die Höhe der zu entrichtenden
        Ersatzabgabe
        fest, welche die Hauseigentümerin oder Hauseigentümer zu entrichten haben.
    </p>
    <div style="" id="signature-wrapper">
        <h2>B. Deklaration Hauseigentümerin oder Hauseigentümer</h2>
        <p>
            Die Hauseigentümerin oder der Hauseigentümer der Baute gemäss Bst. A anerkennen und erklären sich bereit
            eine Ersatzabgabe in der Höhe von <b>4'555</b> Franken zu entrichten.
        </p>
        <table style="margin-top: 2cm">
            <tr>
                <td>
                    <input type="text" style="background-color: rgb(245, 246, 246)">
                    <label>Ort, Datum</label>
                </td>
                <td>
                    <input type="text" style="background-color: rgb(245, 246, 246)">
                    <label>Unterschriften</label>
                </td>
            </tr>
        </table>
        <p>
            <i>Dieses Formular ist der für Bauen und Energie zuständigen Gemeindebehörde einzureichen.</i>
        </p>


    </div>

    <p style="margin-top: 4cm"><b>
        Amt für Wasser und Energie AWE
    </b><br>
        Lämmlisbrunnenstrasse 54, 9001 St.Gallen, Telefon 058 229 30 99, info.awe@sg.ch<br>
        Deklaration Ersatzabgabe / 17.5.2021
    </p>
    <span style="position: absolute; top: 43cm; right: 0">
        <b>2 / 2</b>
        </span>

</div>
</body>
</html>
`


    var milis = new Date();
    milis = milis.getTime();

    var pdfPath = path.join('pdf', `${data.name}-${milis}.pdf`);

    var options = {
        format: 'A4',
        /*margin: {
        top: "10px",
            bottom: "30px"
    },
    */
        path: pdfPath
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        headless: true
    });

    var page = await browser.newPage();

    await page.goto(`data: text/html,${html}`, {
        waitUntil: ['networkidle0']
    });

    pdfOutput = await page.pdf(options);
    await browser.close();

    res.contentType('application/pdf');
    res.send(pdfOutput);

})

router.get('/:id/pdf', async (req, res) => {

    let html = fs.readFileSync('templates/pv_application.html', 'utf8');

    let options = {
        format: "A4",
        orientation: "portrait",
        border: "8.8mm",
    };

    let document = {
        html: html,
        data: {
            name: "Fabio",
            name2: "Göldi"
        },
        path: "pdf/temp.pdf",
        type: "stream",
    };

    pdf
        .create(document, options)
        .then((doc) => {
            res.download(doc.path)
            //res.send("ok")
            console.log(doc);
        })
        .catch((error) => {
            res.send(error)
            console.error(error);
        });

})

// router.get('/:id/pdf3', async (req, res) => {
//     var fs = require('fs')
//
//     let html = fs.readFileSync('templates/pv_application.html', 'utf8');
//
//
//     var conversion = require("phantom-html-to-pdf")();
//     conversion({ html: "<h1>Hello World</h1>" }, function(err, pdf) {
//         var output = fs.createWriteStream('/path/to/output.pdf')
//         console.log(pdf.logs);
//         console.log(pdf.numberOfPages);
//         // since pdf.stream is a node.js stream you can use it
//         // to save the pdf to a file (like in this example) or to
//         // respond an http request.
//         pdf.stream.pipe(output);
//     });
//
// })

module.exports = router;