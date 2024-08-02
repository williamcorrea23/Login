/**
 * v0 by Vercel.
 * @see https://v0.dev/t/CSv5dhe1oJr
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
"use client"

import react from "react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import Link from "next/link"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { CartesianGrid, XAxis, Bar, BarChart, Line, LineChart } from "recharts"
import { ChartTooltipContent, ChartTooltip, ChartContainer } from "@/components/ui/chart"

export default function Component() {
  const [showTestChart, setShowTestChart] = react.useState(false)
  const [showProgressChart, setShowProgressChart] = react.useState(false)
  const [showPaymentHistory, setShowPaymentHistory] = react.useState(false)
  const [showExercises, setShowExercises] = react.useState(true)
  const [showGenerateTest, setShowGenerateTest] = react.useState(false)
  const [showSubjects, setShowSubjects] = react.useState(false)
  const [showEssayForm, setShowEssayForm] = react.useState(false)
  const [showChatbot, setShowChatbot] = react.useState(false)
  const [essayTitle, setEssayTitle] = react.useState("")
  const [essayContent, setEssayContent] = react.useState("")
  const [selectedSubject, setSelectedSubject] = react.useState("")
  const [testScores, setTestScores] = react.useState([
    { name: "Math Practice Test 1", score: 78 },
    { name: "Portuguese Practice Test", score: 85 },
    { name: "Full Mock Exam", score: 72 },
  ])
  const paymentHistory = [
    { name: "Monthly Subscription", amount: 49.99, date: "2023-06-01" },
    { name: "AI Tutoring (10 hours)", amount: 99.99, date: "2023-05-15" },
    { name: "Mock Exam Bundle", amount: 29.99, date: "2023-04-20" },
    { name: "Monthly Subscription", amount: 49.99, date: "2023-05-01" },
    { name: "AI Tutoring (5 hours)", amount: 49.99, date: "2023-04-10" },
  ]
  const [exercises, setExercises] = react.useState([])
  const [selectedMaterial, setSelectedMaterial] = react.useState("")
  const [questionCount, setQuestionCount] = react.useState(15)
  const [timer, setTimer] = react.useState(0)
  const materials = [
    { name: "Matemática", icon: <CalculatorIcon className="h-6 w-6" /> },
    { name: "Português", icon: <BookIcon className="h-6 w-6" /> },
    { name: "História", icon: <CalendarIcon className="h-6 w-6" /> },
    { name: "Ciências", icon: <SpaceIcon className="h-6 w-6" /> },
  ]
  const [chatMessages, setChatMessages] = react.useState([])
  const [newMessage, setNewMessage] = react.useState("")
  const generateTest = () => {
    console.log(`Generating test with ${questionCount} questions from ${selectedMaterial}`)
    setShowGenerateTest(true)
    const generatedExercises = []
    for (let i = 0; i < questionCount; i++) {
      const options = ["Opção A", "Opção B", "Opção C", "Opção D", "Opção E"]
      generatedExercises.push({ id: `q${i + 1}`, options })
    }
    setExercises(generatedExercises)
  }
  const [showPricing, setShowPricing] = react.useState(false)
  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      setChatMessages([...chatMessages, { sender: "user", message: newMessage }])
      setNewMessage("")
      const response = `This is a sample response to your message: "${newMessage}"`
      setChatMessages([...chatMessages, { sender: "user", message: newMessage }, { sender: "bot", message: response }])
    }
  }
  const [isSheetOpen, setIsSheetOpen] = react.useState(false)
  const handleSheetOpen = () => {
    setIsSheetOpen(true)
  }
  const handleSheetClose = () => {
    setIsSheetOpen(false)
  }
  const pricingPlans = [
    {
      name: "Plano Básico",
      price: 19.99,
      features: ["Acesso a exercícios básicos", "Suporte limitado", "Sem chatbot"],
    },
    {
      name: "Plano Premium",
      price: 39.99,
      features: ["Acesso a todos os exercícios", "Suporte ilimitado", "Chatbot com IA", "Acompanhamento de progresso"],
    },
    {
      name: "Plano Pro",
      price: 59.99,
      features: [
        "Acesso a todos os exercícios",
        "Suporte ilimitado",
        "Chatbot com IA",
        "Acompanhamento de progresso",
        "Aulas ao vivo",
        "Redação com correção",
      ],
    },
  ]
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="flex h-[60px] items-center justify-between border-b bg-green-900 px-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full border border-yellow-400 w-8 h-8">
              <span className="sr-only">Toggle user menu</span>
              <GraduationCapIcon className="h-4 w-4 text-yellow-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Configurações</DropdownMenuItem>
            <DropdownMenuItem>Suporte</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sair</DropdownMenuItem>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4">
                  <div className="bg-gray-100 p-4 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Plano Básico</h3>
                    <p className="text-sm mb-2">R$ 19,99/mês</p>
                    <ul className="text-sm list-disc pl-4">
                      <li>Acesso a exercícios básicos</li>
                      <li>Suporte limitado</li>
                      <li>Sem chatbot</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Plano Premium</h3>
                  <p className="text-sm mb-2">R$ 39,99/mês</p>
                  <ul className="text-sm list-disc pl-4">
                    <li>Acesso a todos os exercícios</li>
                    <li>Suporte ilimitado</li>
                    <li>Chatbot com IA</li>
                    <li>Acompanhamento de progresso</li>
                  </ul>
                </div>
                <div className="bg-gray-100 p-4 rounded-md">
                  <h3 className="text-lg font-semibold mb-2">Plano Pro</h3>
                  <p className="text-sm mb-2">R$ 59,99/mês</p>
                  <ul className="text-sm list-disc pl-4">
                    <li>Acesso a todos os exercícios</li>
                    <li>Suporte ilimitado</li>
                    <li>Chatbot com IA</li>
                    <li>Acompanhamento de progresso</li>
                    <li>Aulas ao vivo</li>
                    <li>Redação com correção</li>
                  </ul>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden" onClick={handleSheetOpen}>
              <span className="sr-only">Toggle navigation menu</span>
              <MenuIcon className="h-4 w-4 text-yellow-400" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" onPointerDownOutside={handleSheetClose}>
            <Link href="#" prefetch={false}>
              <span className="sr-only">Home</span>
              <GraduationCapIcon className="h-6 w-6 text-yellow-400" />
            </Link>
            <div className="grid gap-2 py-6">
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  setShowExercises(false)
                  setShowSubjects(false)
                  setShowEssayForm(false)
                  setShowPricing(false)
                  setShowTestChart(true)
                  setShowProgressChart(true)
                  setShowPaymentHistory(true)
                  handleSheetClose()
                }}
                prefetch={false}
              >
                Painel de Controle
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  setShowExercises(true)
                  setShowSubjects(false)
                  setShowEssayForm(false)
                  setShowPricing(false)
                  setShowTestChart(false)
                  setShowProgressChart(false)
                  setShowPaymentHistory(false)
                  handleSheetClose()
                }}
                prefetch={false}
              >
                Exercícios
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  setShowExercises(false)
                  setShowSubjects(true)
                  setShowEssayForm(false)
                  setShowPricing(false)
                  setShowTestChart(false)
                  setShowProgressChart(false)
                  setShowPaymentHistory(false)
                  handleSheetClose()
                }}
                prefetch={false}
              >
                Aulas
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  setShowExercises(false)
                  setShowSubjects(false)
                  setShowEssayForm(true)
                  setShowPricing(false)
                  setShowTestChart(false)
                  setShowProgressChart(false)
                  setShowPaymentHistory(false)
                  handleSheetClose()
                }}
                prefetch={false}
              >
                Redação
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  setShowExercises(false)
                  setShowSubjects(false)
                  setShowEssayForm(false)
                  setShowPricing(true)
                  setShowTestChart(false)
                  setShowProgressChart(false)
                  setShowPaymentHistory(false)
                  handleSheetClose()
                }}
                prefetch={false}
              >
                Preços
              </Link>
              <Link
                href="#"
                className="flex w-full items-center py-2 text-lg font-semibold"
                onClick={() => {
                  setShowExercises(false)
                  setShowSubjects(false)
                  setShowEssayForm(false)
                  setShowPricing(false)
                  setShowTestChart(false)
                  setShowProgressChart(false)
                  setShowPaymentHistory(false)
                  setShowChatbot(true)
                  handleSheetClose()
                }}
                prefetch={false}
              >
                Chatbot
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </header>
      {showTestChart && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Notas dos Testes</h2>
          <BarchartChart className="w-full aspect-[4/3]" />
        </div>
      )}
      {showProgressChart && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Progresso</h2>
          <LinechartChart className="w-full aspect-[4/3]" />
        </div>
      )}
      {showPaymentHistory && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Histórico de Pagamentos</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment, index) => (
                <TableRow key={index}>
                  <TableCell>{payment.name}</TableCell>
                  <TableCell>R$ {payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {showExercises && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Exercícios</h2>
          <div className="mb-4">
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma matéria" />
              </SelectTrigger>
              <SelectContent>
                {materials.map((material) => (
                  <SelectItem key={material.name} value={material.name}>
                    {material.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mb-4">
            <Input
              type="number"
              value={questionCount}
              onChange={(e) => setQuestionCount(parseInt(e.target.value))}
              placeholder="Número de questões"
            />
          </div>
          <div className="mb-4">
            <Button onClick={generateTest}>Gerar Teste</Button>
          </div>
          <div className="mb-4">
            <p>Tempo restante: {timer} segundos</p>
          </div>
          {showGenerateTest &&
            exercises.map((exercise) => (
              <div key={exercise.id} className="mb-4">
                <h3 className="text-lg font-semibold">{exercise.question}</h3>
                <ul className="list-disc pl-4">
                  {exercise.options.map((option, index) => (
                    <li key={index}>
                      <label>
                        <input type="radio" name={exercise.id} value={option} />
                        {option}
                      </label>
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <Button>Enviar</Button>
                  <Button variant="outline" className="ml-2">
                    Mostrar Resposta
                  </Button>
                  {exercise.explanation && (
                    <div className="mt-2 bg-gray-100 p-2 rounded-md">
                      <p className="text-sm font-semibold">Explicação:</p>
                      <p className="text-sm">{exercise.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
      {showSubjects && (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Matérias</h2>
          <div className="grid grid-cols-" />
        </div>
      )}
    </div>
  )
}

function BarchartChart(props) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
        className="min-h-[300px]"
      >
        <BarChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}


function BookIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  )
}


function CalculatorIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" />
      <line x1="8" x2="16" y1="6" y2="6" />
      <line x1="16" x2="16" y1="14" y2="18" />
      <path d="M16 10h.01" />
      <path d="M12 10h.01" />
      <path d="M8 10h.01" />
      <path d="M12 14h.01" />
      <path d="M8 14h.01" />
      <path d="M12 18h.01" />
      <path d="M8 18h.01" />
    </svg>
  )
}


function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  )
}


function GraduationCapIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
      <path d="M22 10v6" />
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
    </svg>
  )
}


function LinechartChart(props) {
  return (
    <div {...props}>
      <ChartContainer
        config={{
          desktop: {
            label: "Desktop",
            color: "hsl(var(--chart-1))",
          },
        }}
      >
        <LineChart
          accessibilityLayer
          data={[
            { month: "January", desktop: 186 },
            { month: "February", desktop: 305 },
            { month: "March", desktop: 237 },
            { month: "April", desktop: 73 },
            { month: "May", desktop: 209 },
            { month: "June", desktop: 214 },
          ]}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Line dataKey="desktop" type="natural" stroke="var(--color-desktop)" strokeWidth={2} dot={false} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}


function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}


function SpaceIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" />
    </svg>
  )
}


function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}