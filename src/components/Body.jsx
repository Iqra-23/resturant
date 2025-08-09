import React from "react";

import bgImage from "../assets/hero.png";

import chefs from "../assets/chef.png";
import menu from "../assets/menu.png";
import coffee from "../assets/coffee.png";
import restaurant1 from "../assets/restaurant.png";
import homeCooking from "../assets/home.png";
import restaurant2 from "../assets/res2.png";


import iconRestaurant from "../assets/resh.png";
import iconPeople from "../assets/people2.png";
import iconHappy from "../assets/happyh1.png";
import iconUsers from "../assets/regularh1.png";


import food1 from "../assets/FOOD1.png";
import food2 from "../assets/FOOD2.png";
import food3 from "../assets/Food3.png";
import chefIcon from "../assets/cheflogo.png"; // small logo (bottom left of each card)

import mainDish from "../assets/maindish.png";
import dish1 from "../assets/dish1.png"; // Ensure this file exists in the specified path
import dish2 from "../assets/dish2.png";
import dish3 from "../assets/dish3.png";




import stepsBg from "../assets/step-bg.png";
import step1 from "../assets/step1.png";
import step2 from "../assets/step2.png";
import step3 from "../assets/step3.png";

import foodLogo1 from "../assets/foodLogo1.png";
import foodLogo2 from "../assets/foodLogo2.png";
import foodLogo3 from "../assets/foodLogo3.png";
import foodLogo4 from "../assets/foodLogo4.png";


import feature1 from "../assets/feature1.png";
import feature2 from "../assets/feature2.png";
import feature3 from "../assets/feature3.png";

import phone from "../assets/phone.png";
import googlePlay from "../assets/google-play.png";
import appStore from "../assets/app-store.png";





const foodItems = [
    {
      image: food1,
      title: "Maenaam Thai Restaurant",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      price: "$85.00",
      rating: "4.25",
      likes: 12,
    },
    {
      image: food2,
      title: "Champignon Somen Noodles",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      price: "$70.00",
      rating: "3.25",
      likes: 10,
    },
    {
      image: food3,
      title: "Tomatoes & Clams Pasta",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry",
      price: "$99.00",
      rating: "5.00",
      likes: 15,
    },
  ];

export default function Body() {
  return (
    <>
      <section
        className="relative text-white bg-cover bg-center py-24 px-4"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Overlay */}
        <div className="bg-black bg-opacity-60 absolute inset-0 z-0"></div>

        {/* Main Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Order <span className="italic font-serif">Food Online From</span> the <br />
            <span className="text-white">Best Restaurants</span>
          </h1>

          {/* Search Bar */}
          <div className="mt-10 inline-block">
            <div className="bg-gradient-to-r from-orange-400 to-yellow-400 p-4 rounded-lg">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Restaurant Name"
                  className="w-full sm:w-72 px-4 py-3 text-gray-700 rounded border-0 outline-none"
                />
                <input
                  type="text"
                  placeholder="🔍 Search Location"
                  className="w-full sm:w-72 px-4 py-3 text-gray-700 rounded border-0 outline-none"
                />
                <button className="bg-red-600 hover:bg-red-700 px-8 py-3 text-white font-semibold rounded whitespace-nowrap">
                  SEARCH
                </button>
              </div>
            </div>
          </div>

    
         {/* Stats */}
         <div className="mt-16 flex flex-wrap justify-center gap-8 text-center text-white">
  {[
    { count: "137", label: "Restaurant", icon: iconRestaurant },
    { count: "158", label: "People Served", icon: iconPeople },
    { count: "659K", label: "Happy Service", icon: iconHappy },
    { count: "235", label: "Regular users", icon: iconUsers },
  ].map((item, index) => (
    <div key={index} className="flex flex-col items-center">
      <div className="w-12 h-12  rounded-full flex items-center justify-center mb-3">
        <img
          src={item.icon}
          alt={item.label}
          className="w-full h-full p-2 object-contain rounded-full"
        />
      </div>
      <p className="text-2xl font-bold">{item.count}</p>
      <p className="text-sm text-gray-300">{item.label}</p>
    </div>
  ))}
</div>


        </div>

       
      </section>

      {/* Top Restaurants Section (Cloud images removed) */}
      <section className="w-full bg-white py-16 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center px-4">
          <p className="text-red-600 font-medium italic text-lg mb-2">
            Website for Restaurant and Cafe
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            TOP RESTAURANTS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Things that get tricky are things like burgers and fries, or things that are
            deep-fried.
            <br />
            We do have a couple of burger restaurants that are capable of doing a good job
            transporting but it's Fries are almost impossible.
          </p>

          {/* Restaurant Icons */}
          <div className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8">
            {[chefs, menu, coffee, restaurant1, homeCooking, restaurant2].map((logo, index) => (
              <div
                key={index}
                className="w-28 h-28 md:w-32 md:h-32 flex items-center justify-center rounded-full border border-gray-200 shadow-md bg-white hover:scale-105 transition-transform duration-300"
              >
                <img src={logo} alt="restaurant logo" className="w-16 h-16 object-contain" />
              </div>
            ))}
          </div>
        </div>
      </section>


        {/* Food Items Section */}
        <section className="py-20 bg-white text-center px-4">
  <p className="text-red-600 font-medium italic text-lg mb-2">
    Your Favorite Food
  </p>
  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-12">
    CHOOSE & ENJOY
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {foodItems.map((item, index) => (
      <div
        key={index}
        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 text-left"
      >
        <div className="relative">
          <img src={item.image} alt={item.title} className="w-full h-56 object-cover" />
          <div className="absolute top-2 right-2 bg-yellow-400 text-black text-sm px-2 py-1 rounded font-semibold shadow">
            ⭐ {item.rating}
          </div>
          <div className="absolute bottom-2 right-2 bg-black text-white text-sm px-2 py-1 rounded flex items-center gap-1 shadow">
            ♥ {item.likes}
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-lg mb-2">{item.title}</h3>
          <p className="text-gray-600 text-sm mb-4">{item.description}</p>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold">{item.price}</span>
            <button className="bg-black text-white text-sm font-semibold px-4 py-2 rounded hover:bg-gray-800">
              ORDER NOW
            </button>
          </div>

          <hr className="my-4" />

          <div className="flex items-center gap-3">
            <img src={chefIcon} alt="chef" className="w-8 h-8" />
            <div>
              <p className="text-sm font-semibold">Fabio al Porto Ristorante</p>
              <p className="text-sm text-pink-600">5th Avenue New York 68</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

<section className="py-20 bg-white px-4">
  <div className="max-w-3xl mx-auto">
    <p className="text-red-600 font-medium italic text-lg mb-2 text-center">
      Website for Restaurant and Cafe
    </p>
    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">
      FEATURED RESTURENTS
    </h2>

    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Left side list */}
      <div className="space-y-3">
        {[{
          image: dish1,
          title: "Tuna Roast Source",
          price: "$85.00",
          rating: "4.25",
          minOrder: "$50",
          time: "30min",
        }, {
          image: dish2,
          title: "Crab With Curry Sources",
          price: "$70.00",
          rating: "4.03",
          minOrder: "$40",
          time: "20min",
        }, {
          image: dish3,
          title: "Imported Salmon Steak",
          price: "$90.00",
          rating: "5.00",
          minOrder: "$60",
          time: "45min",
        }].map((dish, i) => (
          <div key={i} className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img src={dish.image} alt={dish.title} className="w-15 h-15 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm text-pink-600 mb-1">5th Avenue New York 68</p>
              <h4 className="font-bold text-lg">{dish.title}</h4>
              <div className="text-gray-600 text-sm mt-1 flex items-center gap-3">
                <span className="font-bold text-black">{dish.price}</span>
                <span className="flex items-center gap-1 text-xs"><span>🕒</span> Min order {dish.minOrder}</span>
                <span className="flex items-center gap-1 text-xs"><span>🚚</span> {dish.time}</span>
              </div>
            </div>
            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">
              ⭐ {dish.rating}
            </div>
          </div>
        ))}
      </div>

      {/* Right side main highlight */}
      <div className="relative w-full h-full">
        <img src={mainDish} alt="Main Dish" className="w-full h-auto rounded-xl shadow" />
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow flex items-start gap-4">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">
            ▶
          </div>
          <div className="flex-1">
            <p className="text-pink-600 text-sm mb-1">5th Avenue New York 68</p>
            <h4 className="font-bold text-lg text-gray-900">Maenaam Thai Restaurant</h4>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="font-bold text-black">$85.00</span>
              <span className="flex items-center gap-1 text-xs"><span>🕒</span> Min order $50</span>
              <span className="flex items-center gap-1 text-xs"><span>🚚</span> 30min</span>
            </div>
          </div>
          <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow self-start">
            ⭐ 4.25
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<section
  className="relative bg-cover bg-center py-20 text-white"
  style={{ backgroundImage: `url(${stepsBg})` }}
>
  {/* Dark overlay */}
  <div className="absolute inset-0 bg-black opacity-60"></div>

  {/* Main content */}
  <div className="relative z-10 max-w-6xl mx-auto text-center px-4">
    <p className="text-red-500 italic text-lg mb-2">Website for Restaurant and Cafe</p>
    <h2 className="text-3xl md:text-4xl font-extrabold mb-12 text-white">
      EASY ORDER IN 3 STEPS
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          icon: step1,
          number: 1,
          title: "Explore Restaurants",
          desc: "Browse the best restaurants in your city and pick your favorite."
        },
        {
          icon: step2,
          number: 2,
          title: "Choose a Tasty Dish",
          desc: "Select your desired dish from the restaurant’s delicious menu."
        },
        {
          icon: step3,
          number: 3,
          title: "Follow The Status",
          desc: "Track your order in real-time until it reaches your doorstep."
        },
      ].map((step, index) => (
        <div key={index} className="flex flex-col items-center text-center">
          <div className="relative w-24 h-24">
            <img
              src={step.icon}
              alt={step.title}
              className="w-24 h-24 rounded-full border-4 border-white object-contain"
            />
            <div className="absolute -bottom-2 -right-2 bg-red-600 w-7 h-7 text-sm font-bold rounded-full flex items-center justify-center">
              {step.number}
            </div>
          </div>
          <h4 className="text-xl font-bold mt-4 text-white">{step.title}</h4>
          <p className="text-sm mt-2 text-gray-200 max-w-xs">{step.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>



<section className="py-20 bg-white px-4">
  <div className="max-w-3xl mx-auto">
    <p className="text-red-600 font-medium italic text-lg mb-2 text-center">
      Website for Restaurant and Cafe
    </p>
    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">
      FEATURED RESTURENTS
    </h2>

    <div className="grid md:grid-cols-2 gap-10 items-center">
      {/* Left side list */}
      <div className="space-y-3">
        {[{
          image: dish1,
          title: "Tuna Roast Source",
          price: "$85.00",
          rating: "4.25",
          minOrder: "$50",
          time: "30min",
        }, {
          image: dish2,
          title: "Crab With Curry Sources",
          price: "$70.00",
          rating: "4.03",
          minOrder: "$40",
          time: "20min",
        }, {
          image: dish3,
          title: "Imported Salmon Steak",
          price: "$90.00",
          rating: "5.00",
          minOrder: "$60",
          time: "45min",
        }].map((dish, i) => (
          <div key={i} className="flex items-center gap-4 border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <img src={dish.image} alt={dish.title} className="w-15 h-15 rounded-full object-cover" />
            <div className="flex-1">
              <p className="text-sm text-pink-600 mb-1">5th Avenue New York 68</p>
              <h4 className="font-bold text-lg">{dish.title}</h4>
              <div className="text-gray-600 text-sm mt-1 flex items-center gap-3">
                <span className="font-bold text-black">{dish.price}</span>
                <span className="flex items-center gap-1 text-xs"><span>🕒</span> Min order {dish.minOrder}</span>
                <span className="flex items-center gap-1 text-xs"><span>🚚</span> {dish.time}</span>
              </div>
            </div>
            <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow">
              ⭐ {dish.rating}
            </div>
          </div>
        ))}
      </div>

      {/* Right side main highlight */}
      <div className="relative w-full h-full">
        <img src={mainDish} alt="Main Dish" className="w-full h-auto rounded-xl shadow" />
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg p-4 shadow flex items-start gap-4">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center text-white font-bold text-xl">
            ▶
          </div>
          <div className="flex-1">
            <p className="text-pink-600 text-sm mb-1">5th Avenue New York 68</p>
            <h4 className="font-bold text-lg text-gray-900">Maenaam Thai Restaurant</h4>
            <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
              <span className="font-bold text-black">$85.00</span>
              <span className="flex items-center gap-1 text-xs"><span>🕒</span> Min order $50</span>
              <span className="flex items-center gap-1 text-xs"><span>🚚</span> 30min</span>
            </div>
          </div>
          <div className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow self-start">
            ⭐ 4.25
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



<section className="bg-white py-20 px-4">
  <div className="max-w-4xl mx-auto">
    <p className="text-red-500 italic text-lg mb-2 text-center">Your Favourite Food</p>
    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-8">
      CHOOSE YOUR FOOD
    </h2>

    {/* Filters */}
    <div className="flex justify-center gap-4 mb-10">
      {["All", "Beverages", "Burgers", "Pasta"].map((cat, i) => (
        <button
          key={i}
          className={`px-5 py-2 rounded-full border font-semibold ${
            cat === "All"
              ? "bg-yellow-400 text-black"
              : "bg-gray-100 text-gray-700 hover:bg-yellow-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Cards */}
    <div className="grid md:grid-cols-2 gap-6">
      {[{
        logo: foodLogo1,
        name: "Domino's Pizza"
      },{
        logo: foodLogo2,
        name: "Burger King"
      },{
        logo: foodLogo3,
        name: "Wendy's Cafe"
      },{
        logo: foodLogo4,
        name: "Restaurant"
      }].map((item, i) => (
        <div key={i} className="bg-white shadow-md rounded-xl p-6 flex gap-4 items-start justify-between">
          <div className="flex gap-4 items-start">
            <img src={item.logo} alt={item.name} className="w-20 h-20 object-contain" />
            <div>
              <p className="text-sm text-red-500 mb-1">5th Avenue New York 68</p>
              <h3 className="text-lg font-bold mb-1">{item.name}</h3>
              <p className="text-sm text-gray-900 mb-2">
                <span className="font-semibold text-red-600">Type of food:</span>{" "}
                Apple Juice, BBQ, Beef Roast
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                <span>✅ Min order $50</span>
                <span>🚚 30min</span>
              </div>
              <p className="text-sm text-gray-600">💰 Accepts cash & online payments</p>
              <button className="mt-4 px-4 py-2 bg-gray-100 text-sm font-semibold rounded hover:bg-gray-200">
                Order Now
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-red-500 text-sm flex items-center gap-1">❤️ 12</span>
            <span className="bg-yellow-400 text-black px-2 py-1 text-xs font-bold rounded shadow">
              ⭐ 4.25
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


<section className="bg-white py-20 px-4">
  <div className="max-w-6xl mx-auto">
    <p className="text-red-500 italic text-center text-lg mb-1">
      Website for Restaurant and Cafe
    </p>
    <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-10">
      FEATURED RESTURENTS
    </h2>

    <div className="grid md:grid-cols-3 gap-8">
      {[
        {
          img: feature1,
          day: "THU",
          date: "15 Dec 2021",
          title: "Special Food Recipes For DpecialOccasions.",
        },
        {
          img: feature2,
          day: "MON",
          date: "25 Sep 2021",
          title: "Candy Canes Wafer Sweet Roll 2",
        },
        {
          img: feature3,
          day: "WED",
          date: "11 July 2021",
          title: "Cheesecake Pastry Marshmallow",
        },
      ].map((item, idx) => (
        <div key={idx}>
          <img
            src={item.img}
            alt={item.title}
            className="w-full h-64 object-cover rounded"
          />
          <div className="mt-3 flex gap-4 text-xs text-gray-500 items-start">
            <div className="text-center">
              <p className="text-gray-800 font-bold">{item.day}</p>
              <p>{item.date} </p>
              <p>Webinane</p>
            </div>
            <div className="font-semibold text-gray-800">{item.title}</div>
          </div>
          <div className="mt-2 flex gap-6 text-red-500 text-sm ml-[4.5rem]">
            <span className="flex items-center gap-1">
              ❤️ <span>12</span>
            </span>
            <span className="flex items-center gap-1">
              💬 <span>7</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

<section className="relative w-full h-45 bg-[#ed1c24] py-1 overflow-hidden">
  <div className="absolute bottom-0 left-0 w-full">
    <svg
      viewBox="0 0 1440 320"
      className="w-full h-32"
      preserveAspectRatio="none"
    >
      <path
        fill="#ffffff"
        d="M0,64L48,69.3C96,75,192,85,288,117.3C384,149,480,203,576,218.7C672,235,768,213,864,197.3C960,181,1056,171,1152,165.3C1248,160,1344,160,1392,160L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
      ></path>
    </svg>
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between">
    <div className="w-full lg:w-1/2 flex justify-center mb-10 lg:mb-0">
      <img src={phone} alt="Phone" className="w-[250px] lg:w-[300px]" />
    </div>

    <div className="w-full lg:w-1/2 text-white">
      <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
        The Best Food Delivery App
      </h2>
      <p className="text-white mb-6 leading-relaxed max-w-md">
        We have a launch team that focuses on one city at a time. At the end of
        the day, we're a marketplace. In order to make an effective marketplace,
        you need critical mass. We need enough restaurants that offer quality
        and variety.
      </p>
      <div className="flex gap-4">
        <a href="#">
          <img src={googlePlay} alt="Google Play" className="h-12" />
        </a>
        <a href="#">
          <img src={appStore} alt="App Store" className="h-12" />
        </a>
      </div>
    </div>
  </div>
</section>

    </>
  );

}
