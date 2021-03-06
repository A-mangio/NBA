var $owl = $(".owl-carousel").owlCarousel({
	autoplay: true,
	autoplayhoverpause: true,
	autoplaytime: 100,
	loop: true,
	responsive: {
		0: {
			items: 2,
			dots: false
		},
		470 : {
			items: 3,
			dots: false
		},
		800 : {
			items: 5,
			dots: true
		},
		1100 : {
			items: 6,
			dots: true
		}
	}
});

/**
 * Pulisce il localStorage dopo 1 mese
 */
const month = 1;
var now = new Date().getTime();
var setupTime = localStorage.getItem('setupTime')
if (setupTime == null) {
	localStorage.setItem('setupTime', now)
} else if(now - setupTime >= month*1000*60*60*24*30) {
	localStorage.clear()
	localStorage.setItem('setupTime', now);
}

var player_div = document.getElementById("players4team");

/**
 * Funzione asincrona che interrogando le API, salva tutti i teaem NBA nell'owl carousel
 */
async function getAllTeams() {
	if(localStorage.getItem("teams") == null){
		var object = await fetch("https://www.balldontlie.io/api/v1/teams", {
			method: "GET"
		});
		var json = await object.json();
		localStorage.setItem("teams",JSON.stringify(json));
	} else {
		var json = JSON.parse(localStorage.getItem("teams"));
	}

	for (let i = 0; i <= Object.keys(json.data).at(-1); i++) {
		$owl.trigger('add.owl.carousel', ['<div class="card"> <div class="ms-2 me-2"><a value="'+ json.data[i].id +'" onclick="getPlayersTeam(this.getAttribute('+"'value'"+'))" href="#!"><img src="loghi/'+ json.data[i].name +'.png" class="card-img-top"></a><div class="card-body">'+ json.data[i].full_name +'</div> </div> </div>']).trigger("refresh.owl.carousel");	
	}
}

/**
 * Funzione che dato l'id di una squadra, crea una card per giocatore presente nel dato team contenete tutte le informazioni
 */
function getPlayersTeam(team_id) {
	if(localStorage.getItem(team_id) == null) {
		httpGet("data", function(response) {
			if(response.status == 200) {
				var csv = response.responseText
				var players = csv.split('\n');

				/**
				 * Rimuovere tutti i figli per quando viene selezionata un'altra squadra 
				 **/
				while (player_div.lastElementChild) {
	    			player_div.removeChild(player_div.lastElementChild);
	  			}

	  			for(let i = 0; i < players.length; i++) {
	  				let player = players[i].split(';');
	  				if (player[0] == team_id) {
						var div1 = document.createElement("div");
						div1.setAttribute("class", "col-sm-4 pb-2");
						let container = document.createElement("div");
						container.setAttribute("class", "card-container");

						let front = document.createElement("div");
						front.setAttribute("class", "card border-secondary card-front text-center");
						front.setAttribute("id", player[1]+"f");
						let header = document.createElement("div");
						header.setAttribute("class", "card-header");
						let maglia = document.createElement("h5");
						maglia.innerText = player[2];
						header.appendChild(maglia);
						let body = document.createElement("div");
						body.setAttribute("class", "card-body");
						let title = document.createElement("h5");
						title.setAttribute("class", "card-title");
						title.innerText =  player[1];
						body.appendChild(title);
						let ruolo = document.createElement("p");
						ruolo.setAttribute("class", "card-text");
						ruolo.innerText =  player[3];
						body.appendChild(ruolo);
						let nascita = document.createElement("p");
						nascita.setAttribute("class", "card-text");
						nascita.innerText =  player[6];
						body.appendChild(nascita);
						let a = document.createElement("a");
						a.setAttribute("class", "btn btn-primary");
						a.setAttribute("href", "#!");
						a.innerText = "Full bio";
						a.addEventListener('click', () => {
							front.classList.add("card-front-rotate");
							document.getElementById(player[1]+"b").classList.remove("card-back");
							document.getElementById(player[1]+"b").classList.add("card-back-rotate");
						});
						body.appendChild(a);

						front.appendChild(header);
						front.appendChild(body);

						let back = document.createElement("div");
						back.setAttribute("class", "card border-secondary card-back text-center");
						back.setAttribute("id", player[1]+"b");
						let header_back = document.createElement("div");
						header_back.setAttribute("class", "card-header");
						let maglia_back = document.createElement("h5");
						maglia_back.innerText = player[2];
						header_back.appendChild(maglia_back); 
						let body_back = document.createElement("div");
						body_back.setAttribute("class", "card-body");
						let altezza = document.createElement("p");
						altezza.setAttribute("class", "card-text");
						altezza.innerText = "Altezza: " + player[4];
						body_back.appendChild(altezza);
						let massa = document.createElement("p");
						massa.setAttribute("class", "card-text");
						massa.innerText = "Peso: " + player[5];
						body_back.appendChild(massa);
						let stato = document.createElement("p");
						stato.setAttribute("class", "card-text");
						stato.innerText = "Collage: " + player[7];
						body_back.appendChild(stato);
						let a_back = document.createElement("a");
						a_back.setAttribute("class", "btn btn-primary");
						a_back.setAttribute("href", "#!"); 
						a_back.innerText = "Back";
						a_back.addEventListener('click', () => {
							back.classList.remove("card-back-rotate");
							back.classList.add("card-back");
							document.getElementById(player[1]+"f").classList.remove("card-front-rotate");
						});

						body_back.appendChild(a_back);

						back.appendChild(header_back);
						back.appendChild(body_back);

						container.appendChild(front);
						container.appendChild(back);
						div1.appendChild(container);
						player_div.appendChild(div1);
	  				}
	  			}
	  			localStorage.setItem(team_id, player_div.outerHTML);
			} else {
				console.error(JSON.parse(response.responseText).error);
				console.info(JSON.parse(response.responseText).message);
			}
		});
	} else {
		/**
		 * Rimuovere tutti i figli per quando viene selezionata un'altra squadra 
		 **/
		while (player_div.lastElementChild) {
			player_div.removeChild(player_div.lastElementChild);
		}
		player_div.innerHTML = localStorage.getItem(team_id);

		// Ciclo per aggiungere l'evento ai pulsanti dato che passando per il local storage non vengono salvati
		for(let i = 0; i < player_div.children[0].children.length; i++) {
			player_div.children[0].children[i].firstChild.firstChild.lastChild.lastChild.addEventListener('click', () => {
				player_div.children[0].children[i].firstChild.firstChild.classList.add("card-front-rotate");
				document.getElementById(player_div.children[0].children[i].firstChild.lastChild.id).classList.remove("card-back");
				document.getElementById(player_div.children[0].children[i].firstChild.lastChild.id).classList.add("card-back-rotate");
			});
			player_div.children[0].children[i].firstChild.lastChild.lastChild.lastChild.addEventListener('click', () => {
				player_div.children[0].children[i].firstChild.lastChild.classList.remove("card-back-rotate");
				player_div.children[0].children[i].firstChild.lastChild.classList.add("card-back");
				document.getElementById(player_div.children[0].children[i].firstChild.firstChild.id).classList.remove("card-front-rotate");
			});
		}
	}
}

/*
 * Funzione che dato l'url, restituisce il file letto
 */
function httpGet(url, callback) {
	const request = new XMLHttpRequest();

	request.open('get', url, true);
	request.onload = function () {
		callback(request);
	};
	request.send();
}
