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
      } catch (err) {
        console.error("Failed to fetch lessons");
      }
    },
    // add Lessons in the cart and reduces spaces.
    addToCart: function (index) {
      const lesson = this.lessons[index];
      if (lesson.spaces > 0) {
        this.cart.push(lesson);
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

      this.cart = this.cart.filter((item, i) => {
        return i != index;
      });
    },
    // sort method

    sortLessons: function () {
      const modifier = this.sortOrder === "ascending" ? 1 : -1;

      this.lessons.sort((a, b) => {
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
              cart: this.cart,
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

    // search functionality.

    filteredLessons() {
      // create an empty array to store the newLessons.
      let newSearchLessons = [];
      // change the search input to lowercase.
      let toLowerCaseQuery = this.searchQuery.toLowerCase();

      let lessons = this.lessons;
      // loop through all the lessons and check if the input search is matching with what i have in my lessons.
      lessons.forEach((lesson) => {
        if (
          lesson.subject.toLowerCase().includes(toLowerCaseQuery) ||
          lesson.location.toLowerCase().includes(toLowerCaseQuery) ||
          lesson.price.toString().includes(toLowerCaseQuery)
        ) {
          // push the matching lessons.
          newSearchLessons.push(lesson);
        }
      });
      // return the matching lessons.
      return newSearchLessons;
    },
  },
  mounted() {
    this.fetchLessons();
  },
});
