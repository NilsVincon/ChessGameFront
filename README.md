# ChessGameFront

Pour utiliser correctement notre application de jeu d'échecs, veuillez s'il vous plaît suivre ces étapes :

Récupérer le code présent sur https://github.com/NilsVincon/ChessGameBack et https://github.com/NilsVincon/ChessGameFront/.
Dans le terminal du back, faites la commande 'docker compose up' pour lancer le conteneur de la base de données PostgreSQL.
Une fois le conteneur en cours, exécutez le code présent dans le dossier 'initdb'.
Démarrez le back.
Dans le terminal du back, faites la commande 'cd chess-game' puis 'ng serve' pour démarrer le front. S-il y a des erreurs à causes des packages, il faut faire 'cd ..' et 'npm install' + le nom des packages concernés.
Une fois le front démarré, vous pouvez vous créer un compte et vous connecter ou utiliser les comptes : username : Harry password : Covert ; username : Paul password : Harrohide.
Une fois connecté, vous pouvez jouer en local, c'est-à-dire que l'échéquier va tourner à chaque tour pour que 2 joueurs jouent sur le même appareil.
Vous pouvez aussi jouer en ligne via une liaison websocket. Pour cela, ajouter un ami par son username, allez dans Online Game, inviter un ami. Ouvrez un nouvel ( si possible en navigation privée pour pas qu'il y ait de problème avec le localStorage. Connectez vous au compte de la personne que vous avez invitée. Allez dans Online Game et acceptez l'invitation. Les couleurs des joueurs sont attribuées aléatoirement. Vous pouvez maintenant jouer en ligne ( normalement les coups se mettent bien à jour en direct )


Bon jeu ! ♟️♟️
