const Reference = () => {
  return (
    <>
      {/* Sidebar */}
      <div className="sidenav">
        <h1>Nhom 3</h1>
        <ul>
          <li>
            <a href="#" alt="a">
              Search
            </a>
          </li>
          <li>
            <a href="#" alt="a">
              Book
            </a>
          </li>
          <li>
            <a href="#" alt="a">
              Statistic
            </a>
          </li>
          <li>
            <a href="#" alt="a">
              Schedule
            </a>
          </li>
        </ul>
        <div className="icons">
          <a href="#">
            <span className="material-symbols-outlined">account_circle</span>
          </a>
          <a href="#">
            <span className="material-symbols-outlined">settings</span>
          </a>
        </div>
      </div>
      <div className="wrapper">
        <div className="showroom">
          {/* Text size */}
          <div className="text">
            <h1>Hello World</h1>
            <h2>Hello World</h2>
            <h3>Hello World</h3>
            <p>Hello World</p>
          </div>

          {/* input box */}
          <div className="container-blur">
            <div className="all-input">
              <div className="input-cont">
                <h4>Choose date</h4>
                <input className="input-box" type="date" />
              </div>
              <div className="input-cont">
                <h4>Old password</h4>
                <input className="input-box" type="password" />
              </div>
              <div className="input-cont">
                <h4>Enter your name</h4>
                <input className="input-box" type="text" />
              </div>
              <div className="input-cont">
                <h4>Choose your options</h4>
                <select className="input-box">
                  <option />
                  <option value="1">Option 1</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <div className="input-cont">
              <p>From</p>
              <select className="from-input">
                <option />
                <option value="1">Option 1</option>
              </select>
            </div>
            <div className="input-cont">
              <p>To</p>
              <select className="to-input">
                <option />
                <option value="1">Option 1</option>
              </select>
            </div>
            <div className="input-cont">
              <p>Date</p>
              <input className="date-input" type="date" />
            </div>
          </div>
          {/* Choices */}
          <div className="choices">
            <a className="choice" href="#">
              Month
            </a>
            <a className="choice" href="#">
              Year
            </a>
          </div>

          {/*Buttons */}
          <div className="buttons">
            <button className="big-button">Click me</button>
          </div>
        </div>
        <div className="red-line-for-fun">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
          provident praesentium id esse perferendis rem neque necessitatibus
          earum quibusdam doloribus, aliquid consectetur quisquam. Dolores odio
          atque qui minus sapiente aperiam?
        </div>
      </div>
    </>
  );
};

export default Reference;
