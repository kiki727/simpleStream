function simpleStream(initialValue) {
    let value = initialValue;
    const subscribers = [];
  
    function notifySubscribers() {
      for (const subscriber of subscribers) {
        subscriber(value);
      }
    }
  
    function dif(oldVal, newVal) {
      if (typeof oldVal !== typeof newVal) {
        throw new Error(`Nije isti tip: oldVal-${typeof oldVal}, newVal-${typeof newVal}`);
      }
    //  else if (oldVal !== newVal) {
    //     console.log(`- oldValue: ${oldVal}, newValue: ${newVal}`);
    //   }
    }
  
    function stream(newValue) {
      if (arguments.length) {
        dif(value, newValue);
        value = newValue;
        notifySubscribers();
      }
      return value;
    }
  
    stream._map = function (fn) {
      const newStream = simpleStream(fn(value));
      subscribers.push(newStream);
      return newStream;
    };
  
    stream.map = function (fn) {
      return stream._map(fn);
    };
  
    stream.scan = function (fn, acc) {
      const newStream = simpleStream(acc);
      subscribers.push((newValue) => {
        const nextValue = fn(newStream(), newValue);
        newStream(nextValue);
      });
      return newStream;
    };
  
    return stream;
  }
  
  // Primer upotrebe
  const source = simpleStream(0);
  
  const doubled = source.map((value) => value * 2);
  
  const sum = source.scan((acc, value) => acc + value, 0);
  
  source(5);  // Nema greške jer je inicijalna vrednost
  source(10); // Nema greške jer se vrednost menja sa 5 na 10
  source("10"); // Nije isti tip - oldVal-number, newVal-string
  
  console.log(doubled()); // Output: 20
  console.log(sum());     // Output: 15
