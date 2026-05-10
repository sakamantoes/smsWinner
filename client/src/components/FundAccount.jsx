import { useState } from "react";

const FundingButton = () => {
  const [formData, setFormData] = useState({
    email: "",
    amount: 0,
  });

  const handleSubmit = () => {};

  return (
    <div className="fixed bg-white/20 left-0 bottom-0 w-full h-screen">
      <div>
        <form>
          <label>
            <span>Email:</span>
            <input name="email" type="email" />
          </label>
          <label>
            <span>Amount:</span>
            <input name="amount" type="number" />
          </label>
          <label>
            <span>Firstname:</span>
            <input name="amount" type="number" />
          </label>
          <label>
            <span>LastName:</span>
            <input name="amount" type="number" />
          </label>

          <button>proceed</button>
        </form>
      </div>
    </div>
  );
};
