<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;

class CategoriesController extends Controller
{
    public function index(Request $request)
    {
        $category = Category::get();

        return response()->json([
            'category' => $category
        ]);
    }
}
