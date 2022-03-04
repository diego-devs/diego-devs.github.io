let mode = "javascript"
const editor = CodeMirror.fromTextArea(code, 
  {
  lineNumbers: true,
  styleActiveLine: true,
  matchBrackets: true,
  scrollbarStyle: "overlay",
  Tab: "indentMore",
  defaultTab: function(cm) {
    if (cm.somethingSelected()) cm.indentSelection("add");
    else cm.replaceSelection("  ", "end");
  },
  mode
})
editor.setOption("theme", "highcontrast-dark")
const x = document.querySelector(".code")
const ro = new ResizeObserver(entries => {
  editor.setSize(10, 10)
})
ro.observe(document.querySelector(".code-container"))

const changeMode = () => {
  mode = mode === "css" ? "javascript" : "css"
  editor.setOption("mode", mode)
}


const Diego = {
  labels: ['self-taught developer', 'programmer', 'musician', 'video editor'],
  age : 25,
  job: 'Freelancer',
  email: 'd_diazmendoza@hotmail.com',
  phone: '+52 5525228477',
  location: {
    country: 'México',
    city: 'Ciudad de México'
  },
  skills: ['Self-taught', 'Fast learner', 'Adaptable', 'Creative'],
  code: ['C#', 'Javascript', 'Python' ],
  tools: ['.NET6', 'ASP.NET', 'WPF', 'EFCore', 'SQL', 'VSCode', 'VS2022', 'Unity'],
  areas: ['Web', 'Desktop', 'Data', 'Videogames'],
  challenge: "I'm on my way to get my first full time job as a .NET junior developer. ",
  goals: ['Become a senior developer before 2026'],
  courses: {
    bootcamp: 'Launch X by Innovaccion Virtual - Microsoft web developer bootcamp',
    linkedinLearning: ['ASP.NET core esencial','Github para programadores', '.NET6 esencial', 'LINQ con C#'],
    udemy: ['C# Complete developer course', 'Unity 2D complete course'],
  },
  certifications: ['C# Basic Certificate - by HackerRank', 'Github para desarrolladores - by LinkedInLearning'],
}