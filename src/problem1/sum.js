// Arithmetic Progression
var sum_to_n_a = function (n) {
  return ((n + 1) * n) / 2;
};


// Iteriate
var sum_to_n_b = function (n) {
  var sum = 0;
  for (var i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// Recursive
var sum_to_n_c = function (n) {
  if (n <= 1) return 1;

  return n + sum_to_n_c(n - 1);
};

