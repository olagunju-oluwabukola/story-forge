export async function generateStory({ character, setting, twist }) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `
Write an immersive short story (500-700 words).
Character: ${character}
Setting: ${setting}
Plot twist: ${twist}
Use narrative style, vivid details, and emotional depth.
Provide a strong ending.
`
        }
      ]
    })
  })

  const data = await res.json()
  return data.choices[0].message.content
}
