
document.addEventListener("DOMContentLoaded", function () {
    const currentLocation = document.getElementById("currentLocation");
    const destination = document.getElementById("destination");
    const findRouteButton = document.getElementById("findRouteButton");

    const destinationImage = document.getElementById("destinationImage");
    const destinationTitle = document.getElementById("destinationTitle");
    const destinationDescription = document.getElementById("destinationDescription");
    const routeMessage = document.getElementById("routeMessage");

    const campusMapImage = document.getElementById("campusMapImage");
    const mapPlaceholder = document.getElementById("mapPlaceholder");
    const routeLine = document.getElementById("campusRouteLine");
    const startMarker = document.getElementById("campusStartMarker");
    const endMarker = document.getElementById("campusEndMarker");

    const imageBase = "/static/images/";

    // Campus locations and approximate map positions
    const places = {
        gate: {
            title: "Main Gate",
            image: "main-gate-area.jpg",
            description: "Main entrance to the campus.",
            point: [625, 875]
        },
        engineering: {
            title: "Engineering Building",
            image: "engineering-building.jpg",
            description: "Engineering building and academic spaces.",
            point: [1160, 710]
        },
        pharmacy: {
            title: "Pharmacy Building",
            image: "building.jpg",
            description: "Pharmacy academic building.",
            point: [350, 390]
        },
        mba: {
            title: "MBA Building",
            image: "MBA-building-inner.jpg",
            description: "MBA departments, classrooms and laboratories.",
            point: [300, 645]
        },
        school: {
            title: "11th & 12th Building",
            image: "11th-12th-building.jpg",
            description: "11th and 12th standard building.",
            point: [510, 155]
        },
        canteen: {
            title: "Canteen",
            image: "canteen.jpg",
            description: "Campus canteen and seating area.",
            point: [620, 470]
        },
        polytechnic: {
            title: "Polytechnic Building",
            image: "polytechnic-building.jpg",
            description: "Polytechnic building.",
            point: [1055, 370]
        },
        mechanical: {
            title: "Mechanical Building",
            image: "building.jpg",
            description: "Mechanical building.",
            point: [1320, 425]
        },
        amphitheater: {
            title: "Amphitheater",
            image: "campus-map.jpg",
            description: "Campus amphitheater area.",
            point: [880, 710]
        },
        libraryEntrance: {
            title: "Engineering Library Entrance",
            image: "engineering-entrance-library.jpg",
            description: "Engineering library entrance.",
            point: [620, 700]
        },
        xerox: {
            title: "Xerox Shop",
            image: "building.jpg",
            description: "Xerox shop on campus.",
            point: [1200, 465]
        },
        bcsClass: {
            title: "BCS Computer Science Class — 4th Floor",
            image: "t-y-bcs-classroom-MBA.jpg",
            description: "BCS Computer Science classroom on the 4th floor of the MBA building.",
            point: [300, 645]
        },
        principal: {
            title: "Principal Office",
            image: "principal-office.jpg",
            description: "Principal office serving the campus buildings.",
            point: [510, 155]
        },
        library: {
            title: "Library — 5th Floor",
            image: "library.jpg",
            description: "Library on the 5th floor of the 11th & 12th Building.",
            point: [510, 155]
        }
    };

    function clearRoute() {
        routeLine.setAttribute("points", "");
        routeLine.setAttribute("visibility", "hidden");
        startMarker.setAttribute("visibility", "hidden");
        endMarker.setAttribute("visibility", "hidden");
    }

    function updateMapVisibility() {
        if (campusMapImage.naturalWidth > 0) {
            campusMapImage.style.display = "block";
            mapPlaceholder.hidden = true;
        } else {
            campusMapImage.style.display = "none";
            mapPlaceholder.hidden = false;
        }
    }

    function setDestinationImage(place) {
        destinationImage.onerror = function () {
            this.onerror = null;
            this.src = imageBase + "main-gate-area.jpg";
        };

        destinationImage.src = imageBase + place.image;
        destinationImage.alt = place.title;
    }

    function updateDestinationPreview() {
        const place = places[destination.value];
        if (!place) return;

        destinationTitle.textContent = place.title;
        destinationDescription.textContent = place.description;

        setDestinationImage(place);
        clearRoute();

        routeMessage.textContent =
            "Destination selected: " + place.title +
            ". Click Find My Route to show the markers.";
    }

    function showRoute() {
        const from = places[currentLocation.value];
        const to = places[destination.value];

        if (!from || !to) {
            routeMessage.textContent =
                "Please select a valid location and destination.";
            return;
        }

        if (currentLocation.value === destination.value) {
            clearRoute();
            routeMessage.textContent =
                "You are already at " + to.title +
                ". Choose another destination.";
            return;
        }

        const start = from.point;
        const end = to.point;

        startMarker.setAttribute("cx", start[0]);
        startMarker.setAttribute("cy", start[1]);

        endMarker.setAttribute("cx", end[0]);
        endMarker.setAttribute("cy", end[1]);

        startMarker.setAttribute("visibility", "visible");
        endMarker.setAttribute("visibility", "visible");

        routeLine.setAttribute(
            "points",
            `${start[0]},${start[1]} ${end[0]},${end[1]}`
        );

        routeLine.setAttribute("visibility", "visible");

        routeMessage.textContent =
            "Start: " + from.title +
            " → Destination: " + to.title +
            ". This is an approximate preview, not a verified walking route.";

        document.getElementById("campus-map").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    destination.addEventListener("change", updateDestinationPreview);

    currentLocation.addEventListener("change", function () {
        clearRoute();

        const place = places[currentLocation.value];
        if (!place) return;

        routeMessage.textContent =
            "Starting point: " + place.title +
            ". Now click Find My Route.";
    });

    findRouteButton.addEventListener("click", showRoute);

    document.querySelectorAll("[data-destination]").forEach(function (button) {
        button.addEventListener("click", function () {
            const placeId = button.dataset.destination;

            if (!places[placeId]) return;

            destination.value = placeId;
            updateDestinationPreview();

            document.getElementById("navigation").scrollIntoView({
                behavior: "smooth"
            });
        });
    });

    campusMapImage.addEventListener("load", updateMapVisibility);
    campusMapImage.addEventListener("error", updateMapVisibility);

    updateDestinationPreview();
    updateMapVisibility();
});
