export const Button = ({ variant = "default", size = "default", ...props }: any) => {
  return <button className={`button ${variant} ${size}`} {...props} />
}

export const Input = ({ ...props }: any) => {
  return <input type="text" {...props} />
}

export const Label = ({ ...props }: any) => {
  return <label {...props} />
}

