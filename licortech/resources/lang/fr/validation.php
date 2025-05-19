<?php

return [
    "unique" => ":attribute existe déjà.",
	"required" => ":attribute est obligatoire.",
	"email" => "Email invalide.",
    "integer" => ":attribute doit être numérique.",
    "invalid" => ":attribute invalide.",
	"min" => [
			"numeric" => ":attribute doit être au moins :min.",
			"string" => ":attribute contenir au moins :min caractères.",
	],
	"max" => [
			"numeric" => ":attribute pas plus de :max.",
			"string" => ":attribute ne doit pas dépasser :max caractères.",
	],
    "confirmed_password" => "Le mot de passe était erroné.",
];
