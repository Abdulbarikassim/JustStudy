var app = new Vue({
  el: "#app",
  data: {
    page: "homePage",
    // sorting variables.
    sortCriteria: "name",
    sortOrder: "ascending",
    // store search input.
    searchQuery: "",
    // show checkOut.
    showCheckOut: true,
    // show the modal
    showModal: false,
    // lessons.
    lessons: [],
    submitted: false,
    filteredLessons: [],

    // data to keep truck of the order information.
    order: {
      firstName: "",
      lastName: "",
      email: "",
      state: "",
      phoneNumber: "",
    },
    // states
    states: {
      AD: "Abu Dhabi",
      DU: "Dubai",
      SH: "Sharjah",
      AJ: "Ajman",
      UQ: "Umm Al-Quwain",
      FJ: "Fujairah",
      RK: "Ras Al Khaimah",
    },
    cart: [],
  },
  methods: {
    // fetch all lessons.
    async fetchLessons() {
      try {
        const response = await fetch("http://localhost:5001/api/lessons");
        if (!response.ok) throw new Error("Failed to fetch lessons ");
        const data = await response.json();
        this.lessons = data;
        this.filteredLessons = data;
      } catch (err) {
        console.error("Failed to fetch lessons");
      }
    },
    // add Lessons in the cart and reduces spaces.
    addToCart(lessonId) {
      // Find the lesson by _id
      const lesson = this.lessons.find((lesson) => lesson._id === lessonId);

      if (lesson && lesson.spaces > 0) {
        // Create a copy of the lesson to store in the cart
        const cartItem = { ...lesson };

        //decreate the available spaces.
        cartItem.spaces--;

        // Add the lesson to the cart.
        this.cart.push(cartItem);

        // Decrement spaces.
        lesson.spaces--;
      }
    },
    //updating the lessons spaces using a fetch request.

    async updateLessonSpaces(id, spaces) {
      try {
        const response = await fetch(
          `http://localhost:5001/api/lessons/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ spaces }),
          }
        );
        if (!response.ok) throw new Error("failed to update the spaces");
      } catch (err) {
        console.error(err.message);
      }
    },
    // showCartItems
    showCartItems: function () {
      if (this.cart.length > 0) {
        return (this.showProduct = !this.showProduct);
      } else if (this.cart.length == 0) {
        return (this.showProduct = true);
      } else {
        alert("No items in cart");
      }
    },
    // remove items from the cart.
    removeItem: function (index) {
      const removedItem = this.cart[index];

      const originalLesson = this.lessons.find(
        (lesson) => lesson._id === removedItem._id
      );
      if (originalLesson) {
        originalLesson.spaces++;
      }

      this.updateLessonSpaces(originalLesson._id, originalLesson.spaces);
      this.cart.splice(index, 1);
    },
    // sort method

    sortLessons: function () {
      const modifier = this.sortOrder === "ascending" ? 1 : -1;

      this.filteredLessons.sort((a, b) => {
        if (this.sortCriteria === "name") {
          return modifier * (a.subject > b.subject ? 1 : -1);
        } else if (this.sortCriteria === "location") {
          return modifier * (a.location > b.location ? 1 : -1);
        } else if (this.sortCriteria === "space") {
          return modifier * (a.spaces - b.spaces);
        } else if (this.sortCriteria === "price") {
          return modifier * (a.price - b.price);
        } else if (this.sortCriteria === "rating") {
          return modifier * (a.ratings - b.ratings);
        }
      });
    },
    // Navigate Pages.
    navitagePages: function (page) {
      if (this.page === "homePage") {
        this.page = "productPage";
      } else if (this.page === "productPage") {
        this.page = "homePage";
      } else if (this.page === "checkOutPage") {
        this.page = "productPage";
      }
    },
    naviageToCheckOut(page) {
      this.page = page;
    },
    // submit order.
    async handleSubmit() {
      try {
        const response = await fetch(
          "http://localhost:5001/api/lessons/order",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...this.order,
              cart: this.cart.map((lesson) => ({
                id: lesson._id,
                subject: lesson.subject,
                price: lesson.price,
                location: lesson.location,
              })),
            }),
          }
        );

        if (!response.ok) throw new Error("order submission failed");

        await Promise.all(
          this.cart.map((lesson) =>
            fetch(`http://localhost:5001/api/lessons/${lesson._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ spaces: lesson.spaces }),
            })
          )
        );
        this.submitted = true;
        //refresh lessons to update the changes.
        this.fetchLessons();

        setTimeout(() => {
          this.order = {
            firstName: "",
            lastName: "",
            email: "",
            state: "",
            phoneNumber: "",
          };
          this.cart = [];
        }, 100000);
        this.showModal = true;
      } catch (err) {
        console.error("failed to submit order: ", err.message);
      }
      // You can handle form data here.
    },

    // done with order.

    doneWithOrder() {
      this.page = "homePage";
      // after going to the homePage.

      this.showModal = false;
      this.submitted = false;
    },
    //method for searching lessons.
    async searchLessons() {
      const query = this.searchQuery.trim();
      if (query === "") {
        // Reset the filteredLessons if the query is empty
        this.filteredLessons = [...this.lessons];
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:5001/api/search?q=${encodeURIComponent(query)}`
        );

        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        this.filteredLessons = data;
      } catch (err) {
        console.error("Failed to search lessons", err.message);
      }
    },
  },
  // watcher function.
  watch: {
    isCartEmpty(newValue) {
      if (newValue) {
        this.page = "homePage";
      }
    },
  },
  computed: {
    countCartItems: function () {
      return this.cart.length || "";
    },

    // check if the cart is empty.
    isCartEmpty: function () {
      return this.cart.length === 0;
    },
  },
  mounted() {
    this.fetchLessons().then(() => {
      this.filteredLessons = [...this.lessons];
    });
  },
});
