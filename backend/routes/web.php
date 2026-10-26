<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn () => response()->json(['message' => 'Sipher Web Pvt Ltd CMS API => Welcome to Sipher Web CMS API! .................. Design and Developed by Dharmendra Yadav.']));
