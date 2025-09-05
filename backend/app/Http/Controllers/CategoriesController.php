<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CategoriesController extends Controller
{
    public function index(Request $request)
    {
        $category = Category::get();

        $categories = Category::where('type', 'depense')
            ->orderBy('name', 'asc')
            ->get();

        return response()->json([
            'category' => $category,
            'categories' => $categories
        ]);
    }
}
