<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sign In | TENFLEX</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white font-sans">
  <div class="flex flex-col items-center min-h-screen py-12 px-4">

    <!-- Toggle Buttons -->
    <div class="flex gap-4 mb-10">
      <button id="showSignIn" class="bg-purple-600 px-6 py-2 rounded-lg">Sign In</button>
      <button id="showSignUp" class="bg-gray-700 px-6 py-2 rounded-lg">Sign Up</button>
    </div>

    <!-- Sign In Section -->
    <div id="signInSection" class="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl">
      <h2 class="text-3xl font-bold mb-6 text-center">Sign In</h2>

      <div class="flex justify-between bg-gray-800 p-1 rounded-lg mb-6">
        <button id="freelancerTab" class="w-1/2 py-2 text-center rounded-lg bg-purple-600">Freelancer</button>
        <button id="clientTab" class="w-1/2 py-2 text-center rounded-lg">Client</button>
      </div>

      <form id="signInForm">
        <label class="block mb-2 text-sm">Email Address</label>
        <input type="email" id="email"
          class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600" placeholder="you@example.com" required />

        <label class="block mb-2 text-sm">Password</label>
        <input type="password" id="password"
          class="w-full p-3 mb-6 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-600" placeholder="••••••••" required />

        <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">Sign In</button>

        <div class="my-6 text-center text-gray-400">— or sign in with —</div>

        <div class="flex gap-4">
          <button class="flex-1 py-2 bg-red-600 rounded-lg hover:bg-red-700">Google</button>
        </div>
      </form>
    </div>

    <!-- Sign Up Section -->
    <div id="signUpSection" class="w-full max-w-md p-8 bg-gray-900 rounded-2xl shadow-2xl hidden">
      <h2 class="text-3xl font-bold mb-6 text-center">Create an Account</h2>

      <form id="signUpForm">
        <label class="block mb-2 text-sm">Full Name</label>
        <input type="text" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none" required />

        <label class="block mb-2 text-sm">Email Address</label>
        <input type="email" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none" required />

        <label class="block mb-2 text-sm">Password</label>
        <input type="password" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none" required />

        <label class="block mb-2 text-sm">Location</label>
        <input type="text" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none" required />

        <label class="block mb-2 text-sm">Are you a Freelancer or Client?</label>
        <select id="userType" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none">
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
        </select>

        <div id="extraFreelancerFields">
          <label class="block mb-2 text-sm">Skills</label>
          <input type="text" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none" placeholder="e.g. Web Development" />

          <label class="block mb-2 text-sm">Qualification</label>
          <input type="text" class="w-full p-3 mb-4 rounded-lg bg-gray-800 text-white focus:outline-none" placeholder="e.g. B.Tech CSE" />
        </div>

        <button type="submit" class="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition">Sign Up</button>
      </form>
    </div>
  </div>

  <script>
    const showSignIn = document.getElementById("showSignIn");
    const showSignUp = document.getElementById("showSignUp");
    const signInSection = document.getElementById("signInSection");
    const signUpSection = document.getElementById("signUpSection");
    const userType = document.getElementById("userType");
    const extraFreelancerFields = document.getElementById("extraFreelancerFields");

    const freelancerTab = document.getElementById("freelancerTab");
    const clientTab = document.getElementById("clientTab");

    showSignUp.addEventListener("click", () => {
      signInSection.classList.add("hidden");
      signUpSection.classList.remove("hidden");
      showSignUp.classList.add("bg-purple-600");
      showSignIn.classList.remove("bg-purple-600");
    });

    showSignIn.addEventListener("click", () => {
      signUpSection.classList.add("hidden");
      signInSection.classList.remove("hidden");
      showSignIn.classList.add("bg-purple-600");
      showSignUp.classList.remove("bg-purple-600");
    });

    userType.addEventListener("change", () => {
      if (userType.value === "freelancer") {
        extraFreelancerFields.classList.remove("hidden");
      } else {
        extraFreelancerFields.classList.add("hidden");
      }
    });

    freelancerTab.addEventListener("click", () => {
      freelancerTab.classList.add("bg-purple-600");
      clientTab.classList.remove("bg-purple-600");
    });

    clientTab.addEventListener("click", () => {
      clientTab.classList.add("bg-purple-600");
      freelancerTab.classList.remove("bg-purple-600");
    });

    document.getElementById("signInForm").addEventListener("submit", function(e) {
      e.preventDefault();
      window.location.href = "dashboard.html";
    });

    document.getElementById("signUpForm").addEventListener("submit", function(e) {
      e.preventDefault();
      alert("Sign-up successful!");
      showSignIn.click();
    });
  </script>
</body>
</html>
