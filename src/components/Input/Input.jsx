import "./Input.css"


export default function Input({
    type,
    value,
    placeholder,
    onChange,
   
    reference,
  }) {
    return (
      <div>
       
        <input
          type={type}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          id={reference}
        />
      </div>
    );
  }
  