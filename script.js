var app = new Vue({
  el: "#app",
  data: {
    page: "homePage",
    // sorting variables.
    sortCriteria: "name",
    sortOrder: "ascending",
    // store search input.
    searchQuery: "",
    method: "home",
    // show checkOut.
    showCheckOut: true,
    // show the modal
    showModal: false,
    // lessons.
    lessons: lessons,
    submitted: false,

    // data to keep truck of the order information.
    order: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
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
    // add Lessons in the cart.
    addToCart: function (index) {
      if (this.lessons[index].spaces > 0) {
        this.cart.push(this.lessons[index]);
        this.lessons[index].spaces--;
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
        (lesson) => lesson.id === removedItem.id
      );
      if (originalLesson) {
        originalLesson.spaces++;
      }

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

    handleSubmit() {
      // You can handle form data here.
      this.submitted = true; // Set submitted status to true
      // this.showModal = true;
      setTimeout(() => {
        this.order = {
          firstName: "",
          lastName: "",
          address: "",
          state: "",
          city: "",
        };
      }, 100000);
      this.showModal = true;
    },

    // done with order.

    doneWithOrder() {
      this.page = "homePage";
      // after going to the homePage make the cart empty.
      this.cart = [];
      this.showModal = false;
      this.submitted = false;
      // reset the form.
      this.order = {
        firstName: "",
        lastName: "",
        address: "",
        state: "",
        city: "",
      };
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
      let toCaseQuery = this.searchQuery.toLowerCase();

      let lessons = this.lessons;
      // loop through all the lessons and check if the input search is matching with what i have in my lessons.
      lessons.forEach((lesson) => {
        if (
          lesson.subject.toLowerCase().includes(toCaseQuery) ||
          lesson.location.toLowerCase().includes(toCaseQuery) ||
          lesson.price.toString().includes(toCaseQuery)
        ) {
          // push the matching lessons.
          newSearchLessons.push(lesson);
        }
      });
      // return the matching lessons.
      return newSearchLessons;
    },
  },
});
