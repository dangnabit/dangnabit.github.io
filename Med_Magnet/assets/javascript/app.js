$(document).ready(function() {

    var userEtag = '';
    var drugSelected = [];
    var currentUser;

// firebas congfig and cached functions
    var config = {
        apiKey: "AIzaSyAUYsyg6BMEAfnFRIk2rjrtjQGJ_hQhgO8",
        authDomain: "my-awesome-project-2b194.firebaseapp.com",
        databaseURL: "https://my-awesome-project-2b194.firebaseio.com",
        storageBucket: "my-awesome-project-2b194.appspot.com",
        messagingSenderId: "901877515687"
    };
    firebase.initializeApp(config);

    var database = firebase.database();
    var databaseRef = database.ref();


    var delete_cookie = function(name) {
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    };

    var signout = function() {
        hello('google').logout()
        localStorage.removeItem('hello');
        location.reload();
        delete_cookie('NID');

    };


    var signin = function() {
        hello('google').login();
    }


    // Hello init, contains browers secret
    hello.init({
        google: "901877515687-0d07o7leoihhv3ina4bqcv40ab347q86.apps.googleusercontent.com"
    }, {
        redirect_uri: 'https://dangnabit.github.io/Med_Magnet/index.html'
    });

    hello.on('auth.login', function(auth) {

        // Call user information, for the given network
        hello(auth.network).api('me').then(function(r) {
            console.log(r);
            // Inject it into the container
            var label = document.getElementById('profile_' + auth.network);
            if (!label) {
                label = document.createElement('div');
                label.id = 'profile_' + auth.network;
                document.getElementById('profile').appendChild(label);
            }

            userEtag = r.etag;

            label.innerHTML = '<img src="' + r.thumbnail + '" /> Hey ' + r.name + "<br>" + r.etag;
            var googSession = hello('google').getAuthResponse()

            var googAccessToken = googSession.access_token

            var googExpires = googSession.expires

            console.log(googAccessToken);
            console.log(googExpires);

            writeUserData(r.id, r.name, r.email, r.thumbnail);
            currentUser = r.id,
        });
    });

    // writes user data to firebase
    function writeUserData(userId, name, email, imageUrl) {
        firebase.database().ref('users/' + userId).set({
            username: name,
            profile_picture: imageUrl
        });
    }

    $('#signin').on('click', function() {
        signin();
    })

    $('#signout').on('click', function() {
        signout();
    })

    var pushDrugtoProfile = function(drugs){
        firebase.database().ref('users/' + currentUser).set({
            drugList: drugs
        })
    }


    var pushSymptomtoProfile = function(symptom){
        firebase.database().ref('users/' + currentUser).set({
            symptomList: symptoms
        })
    }
    //URL = Base + (event or label) + apiKey + searchParm

    //global variable to use inside api functions
    var openFDA = {
        baseURL: 'https://api.fda.gov/drug/',
        eventURL: 'event.json',
        labelURL: 'label.json',
        apiKey: '?api_key=ARrMTzhGwZEZgbpDbWgpT0CH3dMqmZVYCca84sX5',
    };




    // Create an array of all the drugs
    var drugArray = [' ', 'Abilify', 'Accupril', 'Aciphex', 'Actonel', 'Actos', 'Adderall', 'Advair', 'Advil', 'Aldactone', 'Aleve', 'Altace', 'Amaryl', 'Ambien', 'Amoxil', 'AndroGel', 'Apresoline', 'Aricept', 'Ativan', 'Augmentin', 'Avapro', 'Avodart', 'Bactroban', 'Bentyl', 'Biaxin', 'Brilinta', 'Buspar', 'Bystolic', 'Caltrate', 'Cardizem', 'Cardura', 'Catapres', 'Ceftin', 'Celebrex', 'Celexa', 'Cialis', 'Cipro', 'Claritin', 'Cleocin', 'Clovate', 'Cogentin', 'Concerta', 'Coreg', 'Coumadin', 'Cozaar', 'Crestor', 'Cymbalta', 'Deltasone', 'Depakote', 'Desyrel', 'Detrol', 'Dexilant', 'Diabeta', 'Diflucan', 'Dilantin', 'Diovan', 'Ditropan', 'Dolophine', 'Dramamine', 'Duragesic', 'Dyazide', 'Effexor', 'Elavil', 'Enbrel', 'Estrace', 'Evista', 'Exelon', 'Flagyl', 'Flexeril', 'Flomax', 'Flonase', 'Focalin', 'Folvite', 'Fosamax', 'Gablofen', 'Glucophage', 'Glucotrol', 'HCTZ', 'Humalog', 'Humira', 'Hytrin', 'Hyzaar', 'Imitrex', 'Inderal', 'Januvia', 'K-Tab', 'Keflex', 'Kenalog', 'Keppra', 'Klonopin', 'Lamictal', 'Lanoxin', 'Lantus', 'Lasix', 'Latuda', 'Levaquin', 'Levemir', 'Levitra', 'Lexapro', 'Lipitor', 'Lopid', 'Lopressor', 'Lotensin', 'Lovenox', 'Lunesta', 'Lyrica', 'Macrobid', 'Medrol', 'Mevacor', 'Minocin', 'Mobic', 'Mycostatin', 'Namenda', 'Nasonex', 'Neurontin', 'Nexium', 'NitroStat SL', 'Nizoral', 'Norvasc', 'Novolog', 'Omnicef', 'Omnipred', 'Onglyza', 'OxyContin', 'Pamelor', 'Patanol', 'Paxil', 'Pen VK', 'Pepcid', 'Percocet', 'Phenergan', 'Plavix', 'Pradaxa', 'Pravachol', 'Premarin', 'Prevacid', 'Prilosec', 'Prinivil', 'Prinizide', 'Pristiq', 'ProAir HFA', 'Procardia', 'Proscar', 'Protonix', 'Prozac', 'Pyridium', 'Reglan', 'Relafen', 'Remeron', 'Requip', 'Restoril', 'Rheumatrex', 'Risperdal', 'Robaxin', 'Robitussin', 'Seroquel', 'Singulair', 'Soma', 'Spiriva', 'Strattera', 'Suboxone', 'Symbicort', 'Synthroid', 'Tamiflu', 'Tenormin', 'Tessalon', 'Topamax', 'Travatan', 'Tricor', 'Tylenol #2', 'Uceris', 'Uloric', 'Ultram', 'Valium', 'Valtrex', 'Vasotec', 'Verelan', 'VESIcare', 'Viagra', 'Vicodin', 'Victoza', 'Voltaren', 'Vytorin', 'Vyvanse', 'Wellbutrin', 'Xalatan', 'Xanax', 'Xarelto', 'Xopenex', 'Zanaflex', 'Zantac', 'Zetia', 'Zithromax', 'Zocor', 'Zofran', 'Zoloft', 'Zovirax', 'Zyloprim', 'Zyprexa', 'Zyrtec'];
    // Create option list of all the drugs
    for (var i = 0; i < drugArray.length; i++) {

        $(".drugselect").append("<option>" + drugArray[i] + "</option>");

    }

    // Execute the Chosen plugin
    $(".drugselect").chosen({
        // Set the drop down bar width
        width: "80%"
    });

    



    // Add the drugs to drugList
    $(".addbutton").on("click", function() {

        event.preventDefault();


        drugSelected.push($(".drugselect").val());

        console.log("array: " + drugSelected)

        pushDrugtoProfile(drugSelected);
    });

    // Retrieve data from Firebase to display in the table
    database.ref().on("child_added", function(childSnapshot) {


        var userDrug;

        $(".table > #drugname").empty();
        for (var i = 0; i < drugSelected.length; i++) {

            userDrug = childSnapshot.val().drugSelected[i];

            // Append data to the DOM (data from firebase)

            $(".table > #drugname").append("<tr><td class='drugadded btn btn-primary btn-sm'>" + userDrug + "</td>" + "<td><button class='deletebtn btn btn-danger btn-xs'>Delete</button></td>" + "</tr>");

        }



        // Append data to the DOM (data from firebase)
        // $(".table > #drugname").append("<tr><td class='drugadded btn btn-primary btn-sm'>" + userDrug + "</td>" + "<td><button class='deletebtn btn btn-danger btn-xs'>Delete</button></td>" + "</tr>");

    });


    // OnCick function to make ajax call to display side effects of each drug from the API database
    $(document).on("click", ".drugadded", function() {

        //      Setting up the ajax URL
        var drugPicked = $(this).text().toUpperCase();


        getSideEffects(drugPicked, function(sideEffects) {

            for (var i = 0; i < sideEffects.length; i++) {

                $("#effectdisplay").append("<tr><td>" + sideEffects[i] + "</td></tr>");

            }

        })

        getConflictingDrugs(drugPicked, function(drugConflicts) {

            for (var i = 0; i < drugConflicts.length; i++) {

                $("#conflictdisplay").append("<tr><td>" + drugConflicts[i] + "</td></tr>");

            }

        });

        // Clear out previous side effects
        $("#effectdisplay").empty();
        $("#conflictdisplay").empty();
    });

    // Listen for clicks to delete a drug selected
    $(document).on("click", ".deletebtn", function() {

        // Delete "tr" from the DOM, but not on Firebase
        $(this).parents("tr").remove();

        // How to delete data from Firebase??
        database.ref().on("child_removed", function(childSnapshot) {

            database.ref().child().remove()

        });
    });

    //openFDA side effects array based on drug brand name
    function getSideEffects(drug, callback) {
        var sideEffects = [];

        //SEARCH drug brand name exact AND COUNT number of reports for that reaction 
        var searchParm = '&search=patient.drug.openfda.brand_name.exact:(%22' + drug.toUpperCase() +
            '%22)&count=patient.reaction.reactionmeddrapt.exact';

        var url = openFDA.baseURL + openFDA.eventURL + openFDA.apiKey + searchParm;

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(response) {

            // 5 for number of side effects to return
            for (var i = 0; i < 5; i++) {
                sideEffects.push(response.results[i].term);
            }

            if (callback) {
                callback(sideEffects);
            } else {
                console.log('no callback passed to getSideEffects()');
            }
        });
    }


    //openFDA warnings and precautions by drug brand name
    function getWarning(drug, callback) {
        var warning = '';

        var searchParm = '&search=openfda.brand_name:(%22' + drug.toUpperCase() + '%22)';

        var url = openFDA.baseURL + openFDA.labelURL + openFDA.apiKey + searchParm;

        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(response) {

            //if drug has warning message
            if (response.results[0].warnings) {
                warning = response.results[0].warnings[0];
            } else if (response.results[0].warnings_and_cautions) {
                warning = response.results[0].warnings_and_cautions[0];
            } else {
                warning = 'Warning label not supplied by drug producer.'
            }

            if (callback) {
                callback(warning);
            } else {
                console.log('no callback passed to getWarning()');
            }
        });

    }


    //openFDA reported drugs with adverse interacyions of drug brand name
    function getConflictingDrugs(drug, callback) {
        var conflictingDrugs = [];

        var searchParm = '&search=patient.drug.openfda.brand_name.exact:(%22' + drug.toUpperCase() +
            '%22)+AND+patient.drug.drugcharacterization:%223%22';

        var url = openFDA.baseURL + openFDA.eventURL + openFDA.apiKey + searchParm;


        $.ajax({
            url: url,
            method: 'GET',
        }).done(function(response) {

            var reportedConflicts = response.results[0].patient.drug

            // 5 for number of side effects to return
            for (var i = 0; i < reportedConflicts.length; i++) {

                //check for duplicate conflict entry
                if (conflictingDrugs.indexOf(reportedConflicts[i].medicinalproduct) === -1 &&
                    reportedConflicts[i].medicinalproduct !== drug.toUpperCase()) {

                    conflictingDrugs.push(reportedConflicts[i].medicinalproduct);

                }

            }

            if (callback) {
                callback(conflictingDrugs);
            } else {
                console.log('no callback passed to getConflictingDrugs()');
            }
        });

    }

});
