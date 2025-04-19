import * as React from "react"

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className="border p-2 rounded focus:outline-none focus:ring focus:border-teal-500"
      {...props}
    />
  )
}