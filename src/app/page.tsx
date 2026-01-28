"use client"

import React, { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { jsPDF } from "jspdf"
import { Download, Upload, Trash2, RotateCcw, Shirt, FileText, Plus, Palette, Loader2, Eye, Ruler, Copy, Check, AlignCenter, Save, FolderOpen, Type, FilePlus, Languages, Grid3X3, Settings2, Layout, Maximize2 } from "lucide-react"
import { saveSessionsToDB, loadSessionsFromDB } from "@/lib/db"

const TRANSLATIONS = {
  es: {
    title: "Mockup Studio",
    new: "NUEVO",
    save: "GUARDAR",
    sessions: "SESIONES",
    preview: "Vista Previa",
    close: "Cerrar",
    download: "Descargar",
    front: "Frontal",
    back: "Trasera",
    areas: "Zonas",
    config: "Diseño",
    inks: "Tintas",
    mockupName: "Nombre del Mockup",
    garmentColor: "Color de Prenda",
    customColorName: "Nombre personalizado del color",
    applyHex: "Aplicar Hex",
    distNeckFront: "Dist. Cuello Frontal",
    distNeckBack: "Dist. Cuello Trasera",
    distBottom: "Dist. Borde Inferior",
    width: "Ancho",
    height: "Alto",
    rotation: "Rotación",
    center: "Centrar",
    printZones: "Zonas de Impresión",
    posVertical: "Pos. Vertical",
    posHorizontal: "Pos. Horizontal",
    upload: "Subir",
    change: "Cambiar",
    design: "Diseño",
    marserInks: "Tintas Marser",
    customPantone: "Pantone Custom",
    name: "Nombre",
    add: "Añadir",
    techSheet: "FICHA TÉCNICA DE PRODUCCIÓN",
    vistaFrontal: "VISTA FRONTAL",
    vistaTrasera: "VISTA TRASERA",
    specsByZone: "ESPECIFICACIONES DE DISEÑO POR ZONA",
    disclaimer: "La imagen es un montaje para tener una referencia visual, para la producción se tendrán en cuenta las especificaciones técnicas del archivo.",
    newProjectConfirm: "¿Seguro que quieres empezar un nuevo proyecto? Se perderán los cambios no guardados.",
    deleteProjectConfirm: "¿Seguro que quieres borrar este proyecto?",
    savedAsNew: "Proyecto guardado como nuevo",
    updatedSuccessfully: "Proyecto actualizado correctamente",
    projectNamePrompt: "Nombre del nuevo proyecto:",
    active: "ACTIU",
    newProject: "Nuevo Proyecto",
    copy: "Copia",
    tshirt: "Camiseta Manga Corta",
    hoodie: "Sudadera con Capucha",
    tote: "Bolsa Tote",
    baseballTshirt: "Camiseta Béisbol",
    pecho: "Pecho",
    espalda: "Espalda",
    mangaIzq: "Manga Izquierda",
    mangaDer: "Manga Derecha",
    areaFrontal: "Área Frontal",
    areaTrasera: "Área Trasera",
    neckLabel: "Distancia Cuello",
    bottomLabel: "Distancia Borde Inferior",
    guides: "Guías",
    quality: "Calidad",
    high: "Alta",
    medium: "Media",
    low: "Baja",
    production: "Producción"
  },
  ca: {
    title: "Mockup Studio",
    new: "NOU",
    save: "DESAR",
    sessions: "SESSIONS",
    preview: "Vista Prèvia",
    close: "Tancar",
    download: "Descarregar",
    front: "Frontal",
    back: "Darrera",
    areas: "Zones",
    config: "Disseny",
    inks: "Tintes",
    mockupName: "Nom del Mockup",
    garmentColor: "Color de la peça",
    customColorName: "Nom personalitzat del color",
    applyHex: "Aplicar Hex",
    distNeckFront: "Dist. Coll Frontal",
    distNeckBack: "Dist. Coll Darrera",
    distBottom: "Dist. Vora Inferior",
    width: "Ample",
    height: "Alt",
    rotation: "Rotació",
    center: "Centrar",
    printZones: "Zones d'Impressió",
    posVertical: "Pos. Vertical",
    posHorizontal: "Pos. Horitzontal",
    upload: "Pujar",
    change: "Canviar",
    design: "Disseny",
    marserInks: "Tintes Marser",
    customPantone: "Pantone Custom",
    name: "Nom",
    add: "Afegir",
    techSheet: "FITXA TÈCNICA DE PRODUCCIÓ",
    vistaFrontal: "VISTA FRONTAL",
    vistaTrasera: "VISTA POSTERIOR",
    specsByZone: "ESPECIFICACIONS DE DISSENY PER ZONA",
    disclaimer: "La imatge és un muntatge per tenir una referència visual, per a la producció es tindran en compte les especificacions tècniques de l'arxiu.",
    newProjectConfirm: "Segur que vols començar un nou projecte? Es perdran els canvis no desats.",
    deleteProjectConfirm: "Segur que vols esborrar aquest projecte?",
    savedAsNew: "Projecte desat com a nou",
    updatedSuccessfully: "Projecte actualitzat correctament",
    projectNamePrompt: "Nom del nou projecte:",
    active: "ACTIU",
    newProject: "Nou Projecte",
    copy: "Còpia",
    tshirt: "Samarreta Mànega Curta",
    hoodie: "Dessuadora amb Caputxa",
    tote: "Bossa Tote",
    baseballTshirt: "Samarreta Beisbol",
    pecho: "Pit",
    espalda: "Esquena",
    mangaIzq: "Mànega Esquerra",
    mangaDer: "Mànega Dreta",
    areaFrontal: "Àrea Frontal",
    areaTrasera: "Àrea Posterior",
    neckLabel: "Distància Coll",
    bottomLabel: "Distància Vora Inferior",
    guides: "Guies",
    quality: "Qualitat",
    high: "Alta",
    medium: "Mitjana",
    low: "Baixa",
    production: "Producción",
    longSleeve: "Camiseta Manga Larga"
  },
  en: {
    title: "Mockup Studio",
    new: "NEW",
    save: "SAVE",
    sessions: "SESSIONS",
    preview: "Preview",
    close: "Close",
    download: "Download",
    front: "Front",
    back: "Back",
    areas: "Zones",
    config: "Design",
    inks: "Inks",
    mockupName: "Mockup Name",
    garmentColor: "Garment Color",
    customColorName: "Custom Color Name",
    applyHex: "Apply Hex",
    distNeckFront: "Front Neck Dist.",
    distNeckBack: "Back Neck Dist.",
    distBottom: "Bottom Edge Dist.",
    width: "Width",
    height: "Height",
    rotation: "Rotation",
    center: "Center",
    printZones: "Print Zones",
    posVertical: "Vertical Pos.",
    posHorizontal: "Horizontal Pos.",
    upload: "Upload",
    change: "Change",
    design: "Design",
    marserInks: "Marser Inks",
    customPantone: "Custom Pantone",
    name: "Name",
    add: "Add",
    techSheet: "TECHNICAL PRODUCTION SHEET",
    vistaFrontal: "FRONT VIEW",
    vistaTrasera: "BACK VIEW",
    specsByZone: "DESIGN SPECIFICATIONS BY ZONE",
    disclaimer: "The image is a mockup for visual reference; production will follow the technical specifications of the file.",
    newProjectConfirm: "Are you sure you want to start a new project? Unsaved changes will be lost.",
    deleteProjectConfirm: "Are you sure you want to delete this project?",
    savedAsNew: "Project saved as new",
    updatedSuccessfully: "Project updated successfully",
    projectNamePrompt: "New project name:",
    active: "ACTIVE",
    newProject: "New Project",
    copy: "Copy",
    tshirt: "Short Sleeve T-Shirt",
    hoodie: "Hoodie",
    tote: "Tote Bag",
    baseballTshirt: "Baseball T-Shirt",
    pecho: "Chest",
    espalda: "Back",
    mangaIzq: "Left Sleeve",
    mangaDer: "Right Sleeve",
    areaFrontal: "Front Area",
    areaTrasera: "Back Area",
    neckLabel: "Neck Distance",
    bottomLabel: "Bottom Edge Distance",
    guides: "Guides",
    quality: "Quality",
    high: "High",
    medium: "Medium",
    low: "Low",
    production: "Production",
    longSleeve: "Long Sleeve T-Shirt"
  }
}

const BASIC_COLORS = [
  { name: "Negro", value: "#1a1a1a" },
  { name: "Blanco", value: "#ffffff" },
  { name: "Natural", value: "#e8e0d5" },
  { name: "Gris Oscuro", value: "#4a4a4a" },
  { name: "Gris Claro", value: "#9ca3af" },
  { name: "Azul Marino", value: "#1e3a5f" },
  { name: "Rojo", value: "#c8102e" },
  { name: "Verde Botella", value: "#215732" },
  { name: "Verde Claro", value: "#a8e4a0" },
  { name: "Amarillo", value: "#ffcd00" },
  { name: "Naranja", hex: "#ff6900", value: "#ff6900" },
  { name: "Rosa", value: "#e91e63" },
  { name: "Azul Royal", value: "#4169e1" },
  { name: "Burdeos", value: "#722f37" },
]

const MARSER_COLORS = [
  { name: "Amarillo Limón", hex: "#f7e600", pantone: "Yellow C" },
  { name: "Amarillo Oro", hex: "#ffd100", pantone: "109 C" },
  { name: "Amarillo Mostaza", hex: "#c99700", pantone: "117 C" },
  { name: "Naranja", hex: "#ff6900", pantone: "151 C" },
  { name: "Rojo Vivo", hex: "#da291c", pantone: "2035 C" },
  { name: "Rojo Intenso", hex: "#c8102e", pantone: "186 C" },
  { name: "Granate", hex: "#6c1d45", pantone: "222 C" },
  { name: "Magenta", hex: "#e91e8c", pantone: "233 C" },
  { name: "Púrpura", hex: "#6d2077", pantone: "2612 C" },
  { name: "Azul Claro", hex: "#0085ca", pantone: "3005 C" },
  { name: "Azul Real", hex: "#0033a0", pantone: "293 C" },
  { name: "Azul Marino", hex: "#001f5b", pantone: "289 C" },
  { name: "Verde Oscuro", hex: "#154734", pantone: "3435 C" },
  { name: "Verde Claro", hex: "#00a651", pantone: "354 C" },
  { name: "Marrón Oscuro", hex: "#4e3629", pantone: "4625 C" },
  { name: "Marrón Claro", hex: "#a67c52", pantone: "729 C" },
  { name: "Gris", hex: "#6d6e71", pantone: "Cool Gray 10 C" },
  { name: "Negro", hex: "#000000", pantone: "Black C" },
  { name: "Blanco", hex: "#ffffff", pantone: "White C" },
]

type Language = 'es' | 'ca' | 'en'
type PrintPosition = "pecho" | "espalda" | "manga-izq" | "manga-der" | "frente-tote" | "trasera-tote"

interface PrintArea {
  id: PrintPosition
  nameKey: keyof typeof TRANSLATIONS['es']
  widthCm: number
  heightCm: number
  side: "front" | "back"
}

interface ProductDefinition {
  type: string
  nameKey: keyof typeof TRANSLATIONS['es']
  frontImg: string
  backImg: string
  visualWidth: number
  areas: PrintArea[]
  pixelRatio?: number
}

const PRODUCT_CATALOG: ProductDefinition[] = [
  {
    type: "tshirt",
    nameKey: "tshirt",
    frontImg: "/tee-front.png",
    backImg: "/tee-back.png",
    visualWidth: 400,
    areas: [
      { id: "pecho", nameKey: "pecho", widthCm: 32, heightCm: 45, side: "front" },
      { id: "espalda", nameKey: "espalda", widthCm: 32, heightCm: 45, side: "back" },
      { id: "manga-izq", nameKey: "mangaIzq", widthCm: 10, heightCm: 10, side: "front" },
      { id: "manga-der", nameKey: "mangaDer", widthCm: 10, heightCm: 10, side: "front" },
    ]
  },
  {
    type: "hoodie",
    nameKey: "hoodie",
    frontImg: "/hoodie-front.png",
    backImg: "/hoodie-back.png",
    visualWidth: 450,
    areas: [
      { id: "pecho", nameKey: "pecho", widthCm: 32, heightCm: 45, side: "front" },
      { id: "espalda", nameKey: "espalda", widthCm: 32, heightCm: 45, side: "back" },
      { id: "manga-izq", nameKey: "mangaIzq", widthCm: 8, heightCm: 45, side: "front" },
      { id: "manga-der", nameKey: "mangaDer", widthCm: 8, heightCm: 45, side: "front" },
    ],
    pixelRatio: 7.5
  },
  {
    type: "longSleeve",
    nameKey: "longSleeve",
    frontImg: "/longtee-front.png",
    backImg: "/longtee-back.png",
    visualWidth: 400,
    areas: [
      { id: "pecho", nameKey: "pecho", widthCm: 32, heightCm: 45, side: "front" },
      { id: "espalda", nameKey: "espalda", widthCm: 32, heightCm: 45, side: "back" },
      { id: "manga-izq", nameKey: "mangaIzq", widthCm: 10, heightCm: 35, side: "front" },
      { id: "manga-der", nameKey: "mangaDer", widthCm: 10, heightCm: 35, side: "front" },
    ]
  },
  {
    type: "tote",
    nameKey: "tote",
    frontImg: "/tote-front.png",
    backImg: "/tote-front.png",
    visualWidth: 300,
    areas: [
      { id: "frente-tote", nameKey: "areaFrontal", widthCm: 30, heightCm: 35, side: "front" },
      { id: "trasera-tote", nameKey: "areaTrasera", widthCm: 30, heightCm: 35, side: "back" },
    ],
    pixelRatio: 9
  },
  {
    type: "baseballTshirt",
    nameKey: "baseballTshirt",
    frontImg: "/baseballtee-front.png",
    backImg: "/baseballtee-back.png",
    visualWidth: 400,
    areas: [
      { id: "pecho", nameKey: "pecho", widthCm: 32, heightCm: 45, side: "front" },
      { id: "espalda", nameKey: "espalda", widthCm: 32, heightCm: 45, side: "back" },
      { id: "manga-izq", nameKey: "mangaIzq", widthCm: 10, heightCm: 10, side: "front" },
      { id: "manga-der", nameKey: "mangaDer", widthCm: 10, heightCm: 10, side: "front" },
    ]
  }
]

const DEFAULT_PIXEL_RATIO = 8

interface PrintColor {
  id: string
  name: string
  pantone: string
  hex: string
}

interface Design {
  id: string
  src: string
  x: number
  y: number
  width: number
  height: number
  widthCm: number
  heightCm: number
  rotation: number
  side: "front" | "back"
  areaId: PrintPosition
}

interface Product {
  id: string
  type: string
  customName?: string
  shirtColor: string
  shirtColorName?: string
  designs: Design[]
  neckDistanceFrontCm: number
  neckDistanceBackCm: number
  printColors: PrintColor[]
  activePrintAreas: PrintPosition[]
  areaYOffsets: { [key: string]: number }
  areaXOffsets: { [key: string]: number }
}

export default function MockupGenerator() {
  const [lang, setLang] = useState<Language>('es')
  const [showGuides, setShowGuides] = useState(true)
  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod-1",
      type: "tshirt",
      customName: "",
      shirtColor: "#1a1a1a",
      shirtColorName: "Negro",
      designs: [],
      neckDistanceFrontCm: 8,
      neckDistanceBackCm: 5,
      printColors: [{ id: "1", name: "Blanco", pantone: "White C", hex: "#ffffff" }],
      activePrintAreas: [],
      areaYOffsets: {},
      areaXOffsets: {}
    }
  ])
  const [activeProductId, setActiveProductId] = useState("prod-1")
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [selectedDesignId, setSelectedDesignId] = useState<string | null>(null)
  const [currentSide, setCurrentSide] = useState<"front" | "back">("front")
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isExportingJPG, setIsExportingJPG] = useState(false)
  const [isExportingPDF, setIsExportingPDF] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [previewType, setPreviewType] = useState<"jpg" | "pdf" | null>(null)
  const [customColor, setCustomColor] = useState("#1a1a1a")
  const [newColorName, setNewColorName] = useState("")
  const [newColorPantone, setNewColorPantone] = useState("")
  const [newColorHex, setNewColorHex] = useState("#000000")
  const [exportQuality, setExportQuality] = useState<"high" | "medium" | "low">("high")
  const [sessions, setSessions] = useState<{ id: string, name: string, date: string, data: Product[] }[]>([])

  const [showAddMenu, setShowAddMenu] = useState(false)

  const t = (key: keyof typeof TRANSLATIONS['es']) => TRANSLATIONS[lang][key] || key

  const LOGO_URL = "/stampa-logo.png"
  const CONTACT_INFO = [
    "info@stampa.cat | stampa.cat | stampa-serigrafia.com",
    "Tel. Fix: (+34) 931 80 11 79",
    "Tel. Mòvil: (+34) 640 68 12 75"
  ]

  const activeProduct = products.find(p => p.id === activeProductId) || products[0]
  const productDef = PRODUCT_CATALOG.find(p => p.type === activeProduct.type) || PRODUCT_CATALOG[0]

  const getShirtColorName = (product: Product) => {
    if (product.shirtColorName) return product.shirtColorName;
    const color = BASIC_COLORS.find(c => c.value.toLowerCase() === product.shirtColor.toLowerCase());
    return color ? color.name : product.shirtColor.toUpperCase();
  };

  const mockupRef = useRef<HTMLDivElement>(null)
  const areaFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({})

  const getPixelRatio = () => {
    return productDef.pixelRatio || DEFAULT_PIXEL_RATIO
  }

  useEffect(() => {
    const loadData = async () => {
      try {
        let savedSessions = await loadSessionsFromDB()

        if (savedSessions.length === 0) {
          const legacy = localStorage.getItem("mockup-sessions")
          if (legacy) {
            savedSessions = JSON.parse(legacy)
            await saveSessionsToDB(savedSessions)
            localStorage.removeItem("mockup-sessions")
          }
        }

        setSessions(savedSessions)
      } catch (e) {
        console.error("Error loading sessions", e)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const saveSession = async (forceNew = false) => {
    const isNew = forceNew || !activeSessionId
    let name = ""
    let id = activeSessionId

    if (isNew) {
      const defaultName = `${t('newProject')} ${new Date().toLocaleDateString()}`
      name = prompt(t('projectNamePrompt'), defaultName) || ""
      if (!name) return
      id = Date.now().toString()
    } else {
      const session = sessions.find(s => s.id === activeSessionId)
      name = session?.name || "Proyecto"
    }

    const sessionData = {
      id: id!,
      name,
      date: new Date().toLocaleString(),
      data: products
    }

    const updated = isNew
      ? [sessionData, ...sessions]
      : sessions.map(s => s.id === id ? sessionData : s)

    setSessions(updated)
    setActiveSessionId(id)
    try {
      await saveSessionsToDB(updated)
      alert(isNew ? t('savedAsNew') : t('updatedSuccessfully'))
    } catch (e) {
      console.error("Error saving session", e)
      alert("Error al guardar: Espacio insuficiente o error de base de datos.")
    }
  }

  const startNewProject = () => {
    if (!confirm(t('newProjectConfirm'))) return
    setProducts([{
      id: "prod-1",
      type: "tshirt",
      customName: "",
      shirtColor: "#1a1a1a",
      shirtColorName: "Negro",
      designs: [],
      neckDistanceFrontCm: 8,
      neckDistanceBackCm: 5,
      printColors: [{ id: "1", name: "Blanco", pantone: "White C", hex: "#ffffff" }],
      activePrintAreas: [],
      areaYOffsets: {},
      areaXOffsets: {}
    }])
    setActiveProductId("prod-1")
    setActiveSessionId(null)
  }

  const deleteSession = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (!confirm(t('deleteProjectConfirm'))) return
    const updated = sessions.filter(s => s.id !== id)
    setSessions(updated)
    try {
      await saveSessionsToDB(updated)
      if (activeSessionId === id) setActiveSessionId(null)
    } catch (e) {
      console.error("Error deleting session", e)
    }
  }

  const loadSession = (session: typeof sessions[0]) => {
    setProducts(session.data)
    setActiveProductId(session.data[0].id)
    setActiveSessionId(session.id)
  }

  const updateActiveProduct = useCallback((updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === activeProductId ? { ...p, ...updates } : p))
  }, [activeProductId])

  const centerDesign = (id: string) => {
    const design = activeProduct.designs.find(d => d.id === id)
    if (!design) return
    const areaDims = getAreaDimensions(design.areaId)
    updateDesign(id, {
      x: (areaDims.widthPx - design.width) / 2
    })
  }

  const getAreaDimensions = (areaId: PrintPosition) => {
    const area = productDef.areas.find(a => a.id === areaId)
    const ratio = getPixelRatio()
    return {
      widthCm: area?.widthCm || 32,
      heightCm: area?.heightCm || 45,
      widthPx: (area?.widthCm || 32) * ratio,
      heightPx: (area?.heightCm || 45) * ratio,
    }
  }

  const handleImageUploadForArea = (e: React.ChangeEvent<HTMLInputElement>, areaId: PrintPosition) => {
    const file = e.target.files?.[0]
    if (file) {
      const area = productDef.areas.find(a => a.id === areaId)!
      const areaDims = getAreaDimensions(areaId)

      const reader = new FileReader()
      reader.onload = (event) => {
        const img = new Image()
        img.onload = () => {
          const aspectRatio = img.height / img.width
          const maxWidth = areaDims.widthCm
          const initialWidthCm = Math.min(maxWidth * 0.8, 20)
          const initialHeightCm = Math.min(initialWidthCm * aspectRatio, areaDims.heightCm * 0.8)
          const finalWidthCm = initialHeightCm / aspectRatio

          const newDesign: Design = {
            id: Date.now().toString(),
            src: event.target?.result as string,
            x: (areaDims.widthPx - finalWidthCm * getPixelRatio()) / 2,
            y: 0,
            width: finalWidthCm * getPixelRatio(),
            height: initialHeightCm * getPixelRatio(),
            widthCm: finalWidthCm,
            heightCm: initialHeightCm,
            rotation: 0,
            side: area.side,
            areaId: areaId,
          }
          updateActiveProduct({
            designs: [...activeProduct.designs, newDesign]
          })
          setSelectedDesignId(newDesign.id)
          setCurrentSide(area.side)
        }
        img.src = event.target?.result as string
      }
      reader.readAsDataURL(file)
    }
    if (e.target) e.target.value = ""
  }

  const updateDesign = (id: string, updates: Partial<Design>) => {
    const newDesigns = activeProduct.designs.map(d => {
      if (d.id === id) {
        const areaDims = getAreaDimensions(d.areaId)
        const updated = { ...d, ...updates }
        if (updates.widthCm !== undefined && updates.heightCm === undefined) {
          const aspectRatio = d.heightCm / d.widthCm
          updated.width = updates.widthCm * getPixelRatio()
          updated.heightCm = updates.widthCm * aspectRatio
          updated.height = updated.heightCm * getPixelRatio()
        }
        if (updates.x !== undefined) {
          updated.x = Math.max(0, Math.min(updates.x, areaDims.widthPx - updated.width))
        }
        if (updates.y !== undefined) {
          updated.y = Math.max(0, Math.min(updates.y, areaDims.heightPx - updated.height))
        }
        return updated
      }
      return d
    })
    updateActiveProduct({ designs: newDesigns })
  }

  const deleteDesign = (id: string) => {
    updateActiveProduct({
      designs: activeProduct.designs.filter(d => d.id !== id)
    })
    if (selectedDesignId === id) setSelectedDesignId(null)
  }

  const handleMouseDown = useCallback((e: React.MouseEvent, designId: string) => {
    e.preventDefault()
    setSelectedDesignId(designId)
    setIsDragging(true)
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !selectedDesignId || !mockupRef.current) return

    const printArea = mockupRef.current.querySelector('[data-print-area]')
    if (!printArea) return

    const printRect = printArea.getBoundingClientRect()
    const design = activeProduct.designs.find(d => d.id === selectedDesignId)
    if (!design) return

    const areaDims = getAreaDimensions(design.areaId)
    const newX = e.clientX - printRect.left - dragOffset.x
    const newY = e.clientY - printRect.top - dragOffset.y

    updateDesign(selectedDesignId, {
      x: Math.max(0, Math.min(newX, areaDims.widthPx - design.width)),
      y: Math.max(0, Math.min(newY, areaDims.heightPx - design.height))
    })
  }, [isDragging, selectedDesignId, activeProduct.designs, dragOffset])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const colorizeImage = async (imgUrl: string, color: string, format = "image/png", quality = 0.9): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")
        if (!ctx) { resolve(imgUrl); return }

        // Si es para PDF/JPG, forzamos fondo blanco antes de nada para evitar transparencias oscuras
        if (format === "image/jpeg") {
          ctx.fillStyle = "#ffffff"
          ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx.drawImage(img, 0, 0)

        if (color.toLowerCase() !== "#ffffff" || format === "image/jpeg") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const data = imageData.data
          const r = parseInt(color.slice(1, 3), 16)
          const g = parseInt(color.slice(3, 5), 16)
          const b = parseInt(color.slice(5, 7), 16)

          for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 10) {
              const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
              const factor = gray / 255
              data[i] = Math.round(r * factor)
              data[i + 1] = Math.round(g * factor)
              data[i + 2] = Math.round(b * factor)
              if (format === "image/jpeg") data[i + 3] = 255
            } else if (format === "image/jpeg") {
              // Pixeles transparentes a blanco para evitar fondos oscuros en PDF/JPG
              data[i] = 255
              data[i + 1] = 255
              data[i + 2] = 255
              data[i + 3] = 255
            }
          }
          ctx.putImageData(imageData, 0, 0)
        }

        resolve(canvas.toDataURL(format, quality))
      }
      img.onerror = () => resolve(imgUrl)
      img.src = imgUrl
    })
  }

  const rotateImageOnCanvas = async (src: string, rotationDeg: number): Promise<{ dataUrl: string, width: number, height: number, originalWidth: number, originalHeight: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        const rad = (rotationDeg * Math.PI) / 180
        const sin = Math.abs(Math.sin(rad))
        const cos = Math.abs(Math.cos(rad))

        const newWidth = img.width * cos + img.height * sin
        const newHeight = img.width * sin + img.height * cos

        const canvas = document.createElement("canvas")
        canvas.width = newWidth
        canvas.height = newHeight
        const ctx = canvas.getContext("2d")
        if (!ctx) { resolve({ dataUrl: src, width: img.width, height: img.height, originalWidth: img.width, originalHeight: img.height }); return }

        ctx.translate(newWidth / 2, newHeight / 2)
        ctx.rotate(rad)
        ctx.drawImage(img, -img.width / 2, -img.height / 2)

        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: newWidth,
          height: newHeight,
          originalWidth: img.width,
          originalHeight: img.height
        })
      }
      img.src = src
    })
  }

  const loadImg = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  const exportAsJPG = async () => {
    setIsExportingJPG(true)
    try {
      const canvas = document.createElement("canvas")
      canvas.width = 1200
      canvas.height = 1400
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, 1200, 1400)

      const logoImg = await loadImg(LOGO_URL)
      const logoRatio = logoImg.width / logoImg.height
      const logoH = 40
      const logoW = logoH * logoRatio
      ctx.drawImage(logoImg, 30, 20, logoW, logoH)

      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 22px system-ui"
      ctx.fillText(t('techSheet'), 1200 / 2 - 180, 45)

      ctx.textAlign = "right"
      ctx.font = "10px system-ui"
      CONTACT_INFO.forEach((line, i) => {
        ctx.fillText(line, 1170, 30 + i * 14)
      })
      ctx.textAlign = "left"

      ctx.strokeStyle = "#e2e8f0"
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(30, 80); ctx.lineTo(1170, 80); ctx.stroke()

      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 16px system-ui"
      const displayName = activeProduct.customName || t(productDef.nameKey);
      ctx.fillText(displayName.toUpperCase(), 30, 110)

      ctx.font = "bold 12px system-ui"
      ctx.fillText(`${t('garmentColor').toUpperCase()}:`, 30, 135)
      ctx.fillStyle = activeProduct.shirtColor
      ctx.fillRect(160, 122, 25, 18)
      ctx.strokeStyle = "#000000"
      ctx.strokeRect(160, 122, 25, 18)
      ctx.fillStyle = "#334155"
      const colorLabel = getShirtColorName(activeProduct).toUpperCase();
      ctx.fillText(`${colorLabel} (${activeProduct.shirtColor.toUpperCase()})`, 195, 135)

      const frontColored = await colorizeImage(productDef.frontImg, activeProduct.shirtColor)
      const backColored = await colorizeImage(productDef.backImg, activeProduct.shirtColor)
      const fImg = await loadImg(frontColored)
      const bImg = await loadImg(backColored)

      const aspectF = fImg.height / fImg.width
      const aspectB = bImg.height / bImg.width

      const shirtW = 400
      const shirtHF = shirtW * aspectF
      const shirtHB = shirtW * aspectB

      const yPos = 160
      ctx.drawImage(fImg, 150, yPos, shirtW, shirtHF)
      ctx.drawImage(bImg, 650, yPos, shirtW, shirtHB)

      ctx.textAlign = "center"
      ctx.fillStyle = "#64748b"
      ctx.font = "bold 14px system-ui"
      ctx.fillText(t('vistaFrontal'), 150 + shirtW / 2, yPos + shirtHF + 30)
      ctx.fillText(t('vistaTrasera'), 650 + shirtW / 2, yPos + shirtHB + 30)
      ctx.textAlign = "left"

      const renderDesignsSilent = async (side: "front" | "back", xBase: number, yBase: number, w: number, h: number, neckDist: number) => {
        const sideDesigns = activeProduct.designs.filter(d => d.side === side)
        const mainArea = productDef.areas.find(a => a.side === side && !a.id.includes('manga'))
        if (!mainArea) return

        const areaW = w * 0.41
        const areaH = areaW * (mainArea.heightCm / mainArea.widthCm)
        const yOff = activeProduct.areaYOffsets[mainArea.id] || 0
        const xOff = activeProduct.areaXOffsets[mainArea.id] || 0
        const areaX = xBase + (w - areaW) / 2 + (xOff * (w / 100))

        let areaY = 0
        if (activeProduct.type === 'tote') {
          areaY = yBase + h - areaH - (neckDist * (w / 100)) - (yOff * (w / 100))
        } else {
          areaY = yBase + (h * (activeProduct.type === 'hoodie' ? 0.18 : 0.14)) + (neckDist * (w / 100)) + (yOff * (w / 100))
        }

        if (showGuides) {
          ctx.save()
          ctx.setLineDash([5, 5])
          ctx.strokeStyle = "rgba(245, 158, 11, 0.5)"
          ctx.beginPath()
          ctx.moveTo(areaX + areaW / 2, areaY)
          ctx.lineTo(areaX + areaW / 2, areaY + areaH)
          ctx.stroke()
          ctx.restore()
        }

        for (const design of sideDesigns.filter(d => d.areaId === mainArea.id)) {
          const dImg = await loadImg(design.src)
          const scaleX = areaW / (mainArea.widthCm * CM_TO_PX)
          const scaleY = areaH / (mainArea.heightCm * CM_TO_PX)
          ctx.save()
          ctx.translate(areaX + design.x * scaleX + (design.width * scaleX) / 2, areaY + design.y * scaleY + (design.height * scaleY) / 2)
          ctx.rotate((design.rotation * Math.PI) / 180)
          ctx.drawImage(dImg, -(design.width * scaleX) / 2, -(design.height * scaleY) / 2, design.width * scaleX, design.height * scaleY)
          ctx.restore()
        }

        const sleevePos = side === "front" ? ["manga-izq", "manga-der"] : []
        for (const sId of sleevePos) {
          const sDesign = activeProduct.designs.filter(d => d.areaId === sId)
          if (sDesign.length === 0) continue
          const sArea = productDef.areas.find(a => a.id === sId)
          if (!sArea) continue
          const sW = w * 0.12
          const sH = sW * (sArea.heightCm / sArea.widthCm)
          const sleeveOffset = activeProduct.type === 'hoodie' ? 0.18 : 0.05
          const syOff = activeProduct.areaYOffsets[sId] || 0
          const sxOff = activeProduct.areaXOffsets[sId] || 0
          const sX = (sId === "manga-izq" ? xBase + w * sleeveOffset : xBase + w * (1 - sleeveOffset - 0.12)) + (sxOff * (w / 100))
          const sY = (yBase + h * 0.22) + (syOff * (w / 100))

          for (const d of sDesign) {
            const dImg = await loadImg(d.src)
            const scX = sW / (sArea.widthCm * CM_TO_PX)
            const scY = sH / (sArea.heightCm * CM_TO_PX)
            ctx.save()
            ctx.translate(sX + d.x * scX + (d.width * scX) / 2, sY + d.y * scY + (d.height * scY) / 2)
            ctx.rotate((d.rotation * Math.PI) / 180)
            ctx.drawImage(dImg, -(d.width * scX) / 2, -(d.height * scY) / 2, d.width * scX, d.height * scY)
            ctx.restore()
          }
        }
      }

      await renderDesignsSilent("front", 150, yPos, shirtW, shirtHF, activeProduct.neckDistanceFrontCm)
      await renderDesignsSilent("back", 650, yPos, shirtW, shirtHB, activeProduct.neckDistanceBackCm)

      const specsY = yPos + Math.max(shirtHF, shirtHB) + 100
      ctx.fillStyle = "#f1f5f9"
      ctx.fillRect(30, specsY, 1140, 40)
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 14px system-ui"
      ctx.fillText(t('specsByZone'), 50, specsY + 25)

      let currentY = specsY + 60
      const areasWithContent = productDef.areas.filter(a => activeProduct.designs.some(d => d.areaId === a.id))

      for (const area of areasWithContent) {
        const areaDesigns = activeProduct.designs.filter(d => d.areaId === area.id)
        const isSleeve = area.id.includes('manga')
        const neckDist = (area.side === 'front' ? activeProduct.neckDistanceFrontCm : activeProduct.neckDistanceBackCm) + (activeProduct.areaYOffsets[area.id] || 0)
        const neckLabel = activeProduct.type === 'tote' ? t('bottomLabel') : t('neckLabel')

        ctx.fillStyle = "#1e293b"
        ctx.font = "bold 13px system-ui"
        ctx.fillText(t(area.nameKey).toUpperCase(), 30, currentY)

        if (!isSleeve) {
          ctx.font = "12px system-ui"
          ctx.fillStyle = "#64748b"
          ctx.fillText(`${neckLabel}: ${neckDist.toFixed(1)} cm`, 30, currentY + 20)
        }

        currentY += 40

        for (const design of areaDesigns) {
          const dImg = await loadImg(design.src)
          const thumbH = 80
          const thumbW = (dImg.width / dImg.height) * thumbH

          ctx.fillStyle = activeProduct.shirtColor
          ctx.fillRect(50, currentY, thumbW, thumbH)
          ctx.strokeStyle = "#e2e8f0"
          ctx.strokeRect(50, currentY, thumbW, thumbH)

          ctx.drawImage(dImg, 50, currentY, thumbW, thumbH)
          ctx.fillStyle = "#1e293b"
          ctx.font = "bold 12px system-ui"
          ctx.fillText(`${t('width').toUpperCase()}: ${design.widthCm.toFixed(1)} cm`, 50 + thumbW + 30, currentY + 20)
          ctx.fillText(`${t('height').toUpperCase()}: ${design.heightCm.toFixed(1)} cm`, 50 + thumbW + 30, currentY + 40)
          ctx.font = "bold 12px system-ui"
          ctx.fillText(`${t('inks').toUpperCase()}:`, 50 + thumbW + 180, currentY + 20)
          activeProduct.printColors.forEach((color, idx) => {
            ctx.fillStyle = color.hex
            ctx.beginPath(); ctx.arc(50 + thumbW + 190, currentY + 35 + idx * 20, 6, 0, Math.PI * 2); ctx.fill()
            ctx.fillStyle = "#334155"
            ctx.font = "11px system-ui"
            ctx.fillText(`${color.name} (${color.pantone})`, 50 + thumbW + 205, currentY + 39 + idx * 20)
          })
          currentY += 100
        }
        currentY += 20
        ctx.strokeStyle = "#e2e8f0"
        ctx.beginPath(); ctx.moveTo(30, currentY - 10); ctx.lineTo(1170, currentY - 10); ctx.stroke()
      }

      ctx.fillStyle = "#94a3b8"
      ctx.font = "italic 11px system-ui"
      ctx.textAlign = "center"
      ctx.fillText(t('disclaimer'), 600, 1370)

      const qualityMap = { high: 0.9, medium: 0.6, low: 0.3 }
      const dataUrl = canvas.toDataURL("image/jpeg", qualityMap[exportQuality])
      setPreviewUrl(dataUrl); setPreviewType("jpg")
    } catch (e) { console.error(e) } finally { setIsExportingJPG(false) }
  }

  const exportAsPDF = async () => {
    setIsExportingPDF(true)
    try {
      const qMap = { high: 0.9, medium: 0.6, low: 0.3 }
      const cMap: { [key: string]: 'SLOW' | 'MEDIUM' | 'FAST' } = { high: 'SLOW', medium: 'MEDIUM', low: 'FAST' }
      const qFactor = qMap[exportQuality]
      const compLevel = cMap[exportQuality]

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true
      })
      const logoImg = await loadImg(LOGO_URL)

      const logoRatio = logoImg.width / logoImg.height
      const logoH = 12
      const logoW = logoH * logoRatio

      for (let i = 0; i < products.length; i++) {
        if (i > 0) pdf.addPage()
        const prod = products[i]
        const pDef = PRODUCT_CATALOG.find(pd => pd.type === prod.type) || PRODUCT_CATALOG[0]

        pdf.addImage(logoImg, "JPEG", 10, 10, logoW, logoH, undefined, compLevel)
        pdf.setTextColor(30, 41, 59)
        pdf.setFontSize(14)
        pdf.setFont("helvetica", "bold")
        pdf.text(t('techSheet'), 105, 18, { align: "center" })

        pdf.setFontSize(7)
        pdf.setFont("helvetica", "normal")
        CONTACT_INFO.forEach((line, idx) => {
          pdf.text(line, 200, 12 + idx * 4, { align: "right" })
        })

        pdf.setDrawColor(226, 232, 240)
        pdf.line(10, 30, 200, 30)

        pdf.setFontSize(10)
        pdf.setFont("helvetica", "bold")
        const prodDisplayName = prod.customName || t(pDef.nameKey);
        const prodColorName = getShirtColorName(prod).toUpperCase();
        pdf.text(`${prodDisplayName.toUpperCase()} - COLOR: ${prodColorName} (${prod.shirtColor.toUpperCase()})`, 10, 38)

        // Convert shirt images to PNG to maintain transparency and fix overlay issues
        const fCol = await colorizeImage(pDef.frontImg, prod.shirtColor, "image/png", qFactor)
        const bCol = await colorizeImage(pDef.backImg, prod.shirtColor, "image/png", qFactor)

        const fImg = await loadImg(fCol)
        const bImg = await loadImg(bCol)
        const aspF = fImg.height / fImg.width
        const aspB = bImg.height / bImg.width

        const sW = 100
        const sHF = sW * aspF
        const sHB = sW * aspB
        const xPos = (210 - sW) / 2
        const yFront = 45

        pdf.addImage(fCol, "PNG", xPos, yFront, sW, sHF, undefined, compLevel)

        pdf.setFontSize(9)
        pdf.setTextColor(100, 116, 139)
        pdf.text(t('vistaFrontal'), 105, yFront + sHF + 8, { align: "center" })

        const yBack = yFront + sHF + 20
        pdf.addImage(bCol, "PNG", xPos, yBack, sW, sHB, undefined, compLevel)
        pdf.text(t('vistaTrasera'), 105, yBack + sHB + 8, { align: "center" })

        const drawDesignsSilentPDF = async (side: "front" | "back", xB: number, yB: number, w: number, h: number, nDist: number) => {
          const sideDesigns = prod.designs.filter(d => d.side === side)
          const mArea = pDef.areas.find(a => a.side === side && !a.id.includes('manga'))
          if (!mArea) return

          const aW = w * 0.41
          const aH = aW * (mArea.heightCm / mArea.widthCm)
          const yOff = prod.areaYOffsets[mArea.id] || 0
          const xOff = prod.areaXOffsets[mArea.id] || 0
          const aX = xB + ((w - aW) / 2) + (xOff * (w / 100))

          let aY = 0
          if (prod.type === 'tote') {
            aY = yB + h - aH - (nDist * (w / 100)) - (yOff * (w / 100))
          } else {
            aY = yB + (w * (prod.type === 'hoodie' ? 0.18 : 0.14)) + (nDist * (w / 100)) + (yOff * (w / 100))
          }

          if (showGuides) {
            pdf.saveGraphicsState()
            pdf.setLineDash([2, 2], 0)
            pdf.setDrawColor(245, 158, 11) // Amber
            pdf.line(aX + aW / 2, aY, aX + aW / 2, aY + aH)
            pdf.restoreGraphicsState()
          }

          for (const d of sideDesigns.filter(d => d.areaId === mArea.id)) {
            const sc = aW / (mArea.widthCm * CM_TO_PX)

            // Usamos rotación por canvas para máxima precisión
            const rotated = await rotateImageOnCanvas(d.src, d.rotation)
            const rImg = await loadImg(rotated.dataUrl)
            const rRatio = rImg.height / rImg.width

            // Calculamos el nuevo tamaño manteniendo el centro
            const dW_orig = d.width * sc
            const dH_orig = d.height * sc

            // El tamaño en el PDF debe compensar el crecimiento del canvas al rotar
            // La expansión es relativa a las dimensiones originales del archivo, no a los píxeles de pantalla
            const expansionFactor = rotated.width / rotated.originalWidth
            const dW = dW_orig * expansionFactor
            const dH = dW * rRatio

            // Ajustamos posición para que el centro coincida
            const dX = aX + (d.x * sc) - (dW - dW_orig) / 2
            const dY = aY + (d.y * sc) - (dH - dH_orig) / 2

            pdf.addImage(rotated.dataUrl, "PNG", dX, dY, dW, dH, undefined, compLevel)
          }

          const sPos = side === "front" ? ["manga-izq", "manga-der"] : []
          for (const sId of sPos) {
            const sDesign = prod.designs.filter(d => d.areaId === sId)
            if (sDesign.length === 0) continue
            const sArea = pDef.areas.find(a => a.id === sId)
            if (!sArea) continue
            const syO = prod.areaYOffsets[sId] || 0
            const sxO = prod.areaXOffsets[sId] || 0
            const slW = w * 0.12
            const slH = slW * (sArea.heightCm / sArea.widthCm)
            const sleeveOffset = prod.type === 'hoodie' ? 0.18 : 0.05
            const slXBase = (sId === "manga-izq" ? xB + w * sleeveOffset : xB + w * (1 - sleeveOffset - 0.12))
            const slX = slXBase + (sxO * (w / 100))
            const slY = (yB + w * 0.22) + (syO * (w / 100))

            for (const d of sDesign) {
              const sc = slW / (sArea.widthCm * CM_TO_PX)
              const rotated = await rotateImageOnCanvas(d.src, d.rotation)
              const rImg = await loadImg(rotated.dataUrl)
              const rRatio = rImg.height / rImg.width

              const dW_orig = d.width * sc
              const dH_orig = d.height * sc

              const expansionFactor = rotated.width / rotated.originalWidth
              const dW = dW_orig * expansionFactor
              const dH = dW * rRatio

              const dX = slX + (d.x * sc) - (dW - dW_orig) / 2
              const dY = slY + (d.y * sc) - (dH - dH_orig) / 2

              pdf.addImage(rotated.dataUrl, "PNG", dX, dY, dW, dH, undefined, compLevel)
            }
          }
        }

        await drawDesignsSilentPDF("front", xPos, yFront, sW, sHF, prod.neckDistanceFrontCm)
        await drawDesignsSilentPDF("back", xPos, yBack, sW, sHB, prod.neckDistanceBackCm)

        let pdfY = yBack + sHB + 20
        if (pdfY > 260) { pdf.addPage(); pdfY = 25 }

        pdf.setFillColor(241, 245, 249)
        pdf.rect(10, pdfY, 190, 8, "F")
        pdf.setTextColor(30, 41, 59)
        pdf.setFontSize(9)
        pdf.setFont("helvetica", "bold")
        pdf.text(t('specsByZone'), 15, pdfY + 5.5)
        pdfY += 15

        const areasWithDesignsPDF = pDef.areas.filter(a => prod.designs.some(d => d.areaId === a.id))
        for (const area of areasWithDesignsPDF) {
          const areaDesigns = prod.designs.filter(d => d.areaId === area.id)
          const isSleeve = area.id.includes('manga')
          const nDist = (area.side === 'front' ? prod.neckDistanceFrontCm : prod.neckDistanceBackCm) + (prod.areaYOffsets[area.id] || 0)
          const nLabel = prod.type === 'tote' ? t('bottomLabel') : t('neckLabel')

          if (pdfY > 260) { pdf.addPage(); pdfY = 25 }

          pdf.setFontSize(8)
          pdf.setFont("helvetica", "bold")
          pdf.text(t(area.nameKey).toUpperCase(), 15, pdfY)

          if (!isSleeve) {
            pdf.setFont("helvetica", "normal")
            pdf.setTextColor(100, 116, 139)
            pdf.text(`${nLabel}: ${nDist.toFixed(1)} cm`, 15, pdfY + 4)
          }
          pdfY += 8

          for (const d of areaDesigns) {
            const thumbH = 20
            const dImgTmp = await loadImg(d.src)
            const thumbW = (dImgTmp.width / dImgTmp.height) * thumbH

            pdf.setFillColor(prod.shirtColor)
            pdf.rect(20, pdfY - 2, thumbW, thumbH, "F")
            pdf.setDrawColor(226, 232, 240)
            pdf.rect(20, pdfY - 2, thumbW, thumbH, "S")

            pdf.addImage(d.src, "PNG", 20, pdfY - 2, thumbW, thumbH, undefined, compLevel)

            pdf.setTextColor(30, 41, 59)
            pdf.setFont("helvetica", "bold")
            pdf.text(`${t('width').toUpperCase()}: ${d.widthCm.toFixed(1)} cm`, 20 + thumbW + 10, pdfY + 6)
            pdf.text(`${t('height').toUpperCase()}: ${d.heightCm.toFixed(1)} cm`, 20 + thumbW + 10, pdfY + 12)
            pdf.text(`${t('inks').toUpperCase()}:`, 20 + thumbW + 60, pdfY + 6)
            prod.printColors.forEach((c, idx) => {
              pdf.setFillColor(c.hex)
              pdf.circle(20 + thumbW + 65, pdfY + 11 + idx * 5, 1.5, "F")
              pdf.setFontSize(7)
              pdf.setFont("helvetica", "normal")
              pdf.text(`${c.name} (${c.pantone})`, 20 + thumbW + 68, pdfY + 12 + idx * 5)
            })
            pdfY += 28
            if (pdfY > 270) { pdf.addPage(); pdfY = 25 }
          }
          pdfY += 5
          pdf.setDrawColor(226, 232, 240)
          pdf.line(10, pdfY - 2, 200, pdfY - 2)
          pdfY += 5
        }

        pdf.setFontSize(7)
        pdf.setTextColor(148, 163, 184)
        pdf.setFont("helvetica", "italic")
        pdf.text(t('disclaimer'), 105, 290, { align: "center" })
      }

      const pdfBlob = pdf.output("blob")
      const pdfUrl = URL.createObjectURL(pdfBlob)
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(pdfUrl); setPreviewType("pdf")
    } catch (e) { console.error(e) } finally { setIsExportingPDF(false) }
  }

  const addProduct = (type: string) => {
    const id = `prod-${Date.now()}`
    setProducts(prev => [...prev, {
      id,
      type,
      customName: "",
      shirtColor: "#1a1a1a",
      shirtColorName: "Negro",
      designs: [],
      neckDistanceFrontCm: type === 'tote' ? 5 : 8,
      neckDistanceBackCm: 5,
      printColors: [{ id: "1", name: "Blanco", pantone: "White C", hex: "#ffffff" }],
      activePrintAreas: [],
      areaYOffsets: {},
      areaXOffsets: {}
    }])
    setActiveProductId(id)
    setShowAddMenu(false)
  }

  const deleteProduct = (id: string) => {
    if (products.length <= 1) return
    const newProds = products.filter(p => p.id !== id)
    setProducts(newProds)
    if (activeProductId === id) setActiveProductId(newProds[0].id)
  }

  const duplicateProduct = (prod: Product) => {
    const id = `prod-dup-${Date.now()}`
    setProducts(prev => [...prev, { ...prod, id, customName: prod.customName ? `${prod.customName} (${t('copy')})` : "" }])
    setActiveProductId(id)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased text-slate-900">
      {previewUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-sm" onClick={() => setPreviewUrl(null)}>
          <div className="bg-white rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">{t('preview')}</h3>
              <div className="flex gap-3">
                <Button onClick={() => {
                  const link = document.createElement("a"); link.href = previewUrl;
                  link.download = `ficha-tecnica.${previewType}`; link.click()
                }} className="bg-blue-600 hover:bg-blue-700 font-bold px-6 h-10 shadow-lg shadow-blue-500/20"><Download className="w-4 h-4 mr-2" />{t('download')}</Button>
                <Button variant="outline" onClick={() => setPreviewUrl(null)} className="font-bold px-6 h-10">{t('close')}</Button>
              </div>
            </div>
            {previewType === "jpg" ? <img src={previewUrl} className="w-full rounded-xl border-4 border-slate-100 shadow-2xl" /> : <iframe src={previewUrl} className="w-full h-[70vh] rounded-xl border shadow-inner" />}
          </div>
        </div>
      )}

      {/* TOPBAR: Global Actions */}
      <header className="bg-slate-950 text-white border-b border-slate-800 sticky top-0 z-[100]">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform duration-300 ring-2 ring-blue-400/20">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-[0.2em] uppercase leading-none">{t('title')}</h1>
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.1em] mt-0.5 opacity-80">Pro Studio</p>
              </div>
            </div>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              <div className="relative group">
                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-900 gap-2 h-9 px-3 border border-transparent hover:border-slate-800 rounded-lg">
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{t('sessions')}</span>
                  {activeSessionId && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />}
                </Button>
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-5 z-50 text-slate-900 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('sessions')}</h4>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full" title={t('newProject')} onClick={startNewProject}>
                      <FilePlus className="w-5 h-5" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
                    {sessions.length === 0 && <div className="flex flex-col items-center justify-center py-10 opacity-40 italic"><FolderOpen className="w-8 h-8 mb-2" /><p className="text-[11px] font-bold uppercase tracking-wider">No hay proyectos</p></div>}
                    {sessions.map(s => (
                      <div key={s.id} className="group/item relative">
                        <button onClick={() => loadSession(s)} className={`w-full text-left p-3 hover:bg-slate-50 rounded-xl border transition-all pr-12 ${activeSessionId === s.id ? 'border-blue-200 bg-blue-50/50 ring-2 ring-blue-100/50' : 'border-transparent hover:border-slate-100'}`}>
                          <div className="text-xs font-black text-slate-900 truncate uppercase tracking-tight">{s.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold mt-0.5">{s.date}</div>
                        </button>
                        <button onClick={(e) => deleteSession(e, s.id)} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover/item:opacity-100 transition-all" title="Borrar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => saveSession(false)}
                  className="h-8 text-[10px] px-4 font-black uppercase tracking-widest text-slate-300 hover:text-white hover:bg-blue-600 transition-all rounded-lg"
                >
                  <Save className="w-3.5 h-3.5 mr-2" /> {t('save')}
                </Button>
                {activeSessionId && (
                  <Button variant="ghost" size="sm" onClick={() => saveSession(true)} className="h-8 w-8 p-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg">
                    <Copy className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-slate-900 px-4 py-1.5 rounded-full border border-slate-800">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mr-2">{t('quality')}</span>
              {(['high', 'medium', 'low'] as const).map((q) => (
                <button
                  key={q}
                  onClick={() => setExportQuality(q)}
                  className={`px-3 py-1 text-[9px] font-black rounded-full transition-all uppercase tracking-tight ${exportQuality === q ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {t(q)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={exportAsJPG} disabled={isExportingJPG} className="bg-transparent border-slate-700 text-slate-300 hover:bg-slate-900 hover:text-white h-9 px-4 text-[11px] font-black uppercase tracking-widest rounded-lg border-2">
                {isExportingJPG ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4 mr-2 text-blue-500" />} JPG
              </Button>
              <Button size="sm" onClick={exportAsPDF} disabled={isExportingPDF} className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-6 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg shadow-xl shadow-blue-600/30 border-0 transition-all hover:scale-[1.02] active:scale-[0.98]">
                {isExportingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />} PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* SECONDARY BAR: Product Tabs & Project Utils */}
      <div className="bg-white border-b border-slate-200 sticky top-14 z-[90] shadow-sm">
        <div className="max-w-[1800px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar py-2">
            {products.map((p, idx) => {
              const isActive = activeProductId === p.id;
              const prodType = PRODUCT_CATALOG.find(pc => pc.type === p.type)!;
              return (
                <div key={p.id} className="flex items-center group/tab animate-in slide-in-from-left-2 shrink-0">
                  <button
                    onClick={() => setActiveProductId(p.id)}
                    className={`h-9 px-5 flex items-center gap-3 rounded-l-xl text-[11px] font-black uppercase tracking-widest transition-all border-y border-l ${isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xl translate-y-[-1px] z-10'
                      : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                  >
                    <Shirt className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-300'}`} />
                    <span className="max-w-[140px] truncate">
                      {p.customName || `${t(prodType.nameKey)} ${idx + 1}`}
                    </span>
                  </button>
                  <button onClick={() => duplicateProduct(p)} className={`h-9 px-2.5 border-y border-x transition-colors ${isActive ? 'bg-slate-900 border-slate-900 text-slate-500 hover:text-blue-400 z-10' : 'bg-white border-slate-200 text-slate-300 hover:text-blue-500'}`} title="Duplicar"><Copy className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteProduct(p.id)} className={`h-9 px-3 rounded-r-xl border-y border-r transition-colors ${isActive ? 'bg-slate-900 border-slate-900 text-slate-500 hover:text-red-400 z-10' : 'bg-white border-slate-200 text-slate-300 hover:text-red-500'}`}><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              );
            })}
          </div>

          <div className="relative ml-3 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className={`h-9 w-9 p-0 rounded-xl transition-all border shadow-blue-500/20 group cursor-pointer ${showAddMenu ? 'bg-blue-600 text-white border-blue-600 shadow-lg' : 'bg-slate-50 hover:bg-blue-600 hover:text-white border-slate-200 hover:border-blue-600'}`}
            >
              <Plus className={`w-5 h-5 transition-transform ${showAddMenu ? 'rotate-45' : 'group-hover:rotate-90'}`} />
            </Button>
            {showAddMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl transition-all p-3 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 mb-2">Añadir Producto</div>
                  {PRODUCT_CATALOG.map(cat => (
                    <button key={cat.type} onClick={() => addProduct(cat.type)} className="w-full text-left px-4 py-3 text-[11px] font-black uppercase tracking-widest text-slate-600 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all flex items-center justify-between group/btn">
                      {t(cat.nameKey)}
                      <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover/btn:bg-blue-100 flex items-center justify-center transition-colors">
                        <Plus className="w-3.5 h-3.5 text-slate-400 group-hover/btn:text-blue-600" />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>


          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200">
              {['es', 'ca', 'en'].map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l as Language)}
                  className={`w-9 h-7 text-[10px] font-black rounded-lg transition-all flex items-center justify-center uppercase tracking-tighter ${lang === l ? 'bg-white shadow-sm text-blue-600 ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-700'}`}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-4 gap-2 text-[10px] font-black uppercase tracking-[0.15em] transition-all rounded-xl border border-slate-200 hover:bg-slate-50"
              >
                <Settings2 className="w-4 h-4 text-blue-500" />
                Global
              </Button>
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-4 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black uppercase tracking-widest text-slate-500">{t('guides')}</Label>
                    <button
                      onClick={() => setShowGuides(!showGuides)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${showGuides ? 'bg-blue-600' : 'bg-slate-200'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${showGuides ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-[1800px] mx-auto px-6 py-8 grid lg:grid-cols-[1fr_400px] gap-8">
        {/* CANVAS ZONE */}
        <div className="space-y-6 flex flex-col">
          {/* CANVAS TOOLBAR */}
          <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <Button
                size="sm"
                variant={currentSide === 'front' ? 'default' : 'ghost'}
                onClick={() => setCurrentSide('front')}
                className={`h-9 px-5 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] transition-all ${currentSide === 'front' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t('front')}
              </Button>
              <Button
                size="sm"
                variant={currentSide === 'back' ? 'default' : 'ghost'}
                onClick={() => setCurrentSide('back')}
                className={`h-9 px-5 rounded-lg text-[11px] font-black uppercase tracking-[0.15em] transition-all ${currentSide === 'back' ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {t('back')}
              </Button>
            </div>

            <div className="flex items-center gap-2 pr-2">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                <Grid3X3 className={`w-4 h-4 ${showGuides ? 'text-amber-500' : 'text-slate-300'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t('guides')}</span>
                <button
                  onClick={() => setShowGuides(!showGuides)}
                  className={`w-8 h-4 rounded-full relative transition-colors ${showGuides ? 'bg-amber-400' : 'bg-slate-200'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${showGuides ? 'left-4.5' : 'left-0.5'}`} />
                </button>
              </div>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl" title="Centrar Visual">
                <Maximize2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* MAIN PREVIEW CANVAS */}
          <div className="bg-slate-200/50 rounded-3xl p-12 flex justify-center items-center relative overflow-hidden min-h-[700px] border-2 border-slate-100 shadow-inner flex-1" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
            <div ref={mockupRef} className="relative transition-all duration-500 hover:scale-[1.01]">
              <div className="relative" style={{ width: `${productDef.visualWidth}px` }}>
                <div className="absolute inset-0 z-0 pointer-events-none transition-all duration-300" style={{ backgroundColor: activeProduct.shirtColor, maskImage: `url(${currentSide === 'front' ? productDef.frontImg : productDef.backImg})`, WebkitMaskImage: `url(${currentSide === 'front' ? productDef.frontImg : productDef.backImg})`, maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', maskPosition: 'center' }} />
                <img src={currentSide === 'front' ? productDef.frontImg : productDef.backImg} className="w-full relative z-10 mix-blend-multiply opacity-90 pointer-events-none transition-opacity duration-300" />

                {productDef.areas.filter(a => a.side === currentSide || a.id.includes('manga')).map(area => {
                  if (!activeProduct.activePrintAreas.includes(area.id) && !activeProduct.designs.some(d => d.areaId === area.id)) return null
                  const isMain = area.id === 'pecho' || area.id === 'espalda' || area.id.includes('tote')
                  const isManga = area.id.includes('manga') && currentSide === 'front'
                  if (!isMain && !isManga) return null
                  const w = productDef.visualWidth
                  const h = w * (currentSide === 'front' ? (mockupRef.current?.querySelector('img')?.naturalHeight || 100) / (mockupRef.current?.querySelector('img')?.naturalWidth || 100) : 1)
                  const areaW = w * 0.41
                  const areaH = areaW * (area.heightCm / area.widthCm)
                  const neckDist = currentSide === 'front' ? activeProduct.neckDistanceFrontCm : activeProduct.neckDistanceBackCm
                  const yOffset = activeProduct.areaYOffsets[area.id] || 0
                  const xOffset = activeProduct.areaXOffsets[area.id] || 0
                  const areaX = ((w - areaW) / 2) + (xOffset * (w / 100))
                  let areaY = 0
                  if (activeProduct.type === 'tote') {
                    areaY = h - areaH - (neckDist * (w / 100)) - (yOffset * (w / 100))
                  } else {
                    areaY = (w * (activeProduct.type === 'hoodie' ? 0.18 : 0.14)) + (neckDist * (w / 100)) + (yOffset * (w / 100))
                  }

                  if (isMain) {
                    return (
                      <div key={area.id} data-print-area className="absolute border-2 border-dashed border-amber-500/50 bg-amber-50/5 z-20 transition-all duration-300 group/area" style={{ left: `${areaX}px`, top: `${areaY}px`, width: `${areaW}px`, height: `${areaH}px` }}>
                        {showGuides && <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-amber-500/40 pointer-events-none z-10" />}
                        <div className="absolute -top-6 left-0 flex items-center gap-1 bg-amber-500 text-white text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-t-lg shadow-lg opacity-0 group-hover/area:opacity-100 transition-opacity">
                          <Layout className="w-3 h-3" /> {t(area.nameKey)} {area.widthCm}x{area.heightCm}
                        </div>
                        {activeProduct.designs.filter(d => d.areaId === area.id).map(design => (
                          <div key={design.id} className={`absolute cursor-move transition-all group/design ${selectedDesignId === design.id ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-900/10 shadow-[0_0_30px_rgba(59,130,246,0.3)] z-30' : 'z-20 hover:ring-2 hover:ring-blue-500/50 hover:ring-offset-2'}`} style={{ left: `${(design.x / (area.widthCm * CM_TO_PX)) * 100}%`, top: `${(design.y / (area.heightCm * CM_TO_PX)) * 100}%`, width: `${(design.width / (area.widthCm * CM_TO_PX)) * 100}%`, height: `${(design.height / (area.heightCm * CM_TO_PX)) * 100}%`, transform: `rotate(${design.rotation}deg)` }} onMouseDown={e => handleMouseDown(e, design.id)}>
                            {showGuides && selectedDesignId === design.id && <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-blue-500/50 pointer-events-none shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                            <img src={design.src} className="w-full h-full object-contain pointer-events-none drop-shadow-2xl" />
                          </div>
                        ))}
                      </div>
                    )
                  }
                  if (isManga) {
                    const sW = w * 0.12
                    const sH = sW * (area.heightCm / area.widthCm)
                    const sleeveOffset = activeProduct.type === 'hoodie' ? 0.18 : 0.05
                    const sXBase = area.id === 'manga-izq' ? w * sleeveOffset : w * (1 - sleeveOffset - 0.12)
                    const sY = (w * 0.22) + (yOffset * (w / 100))
                    const sX = sXBase + (xOffset * (w / 100))
                    return (
                      <div key={area.id} className="absolute border-2 border-dashed border-blue-500/40 bg-blue-500/5 z-20 group/area" style={{ left: `${sX}px`, top: `${sY}px`, width: `${sW}px`, height: `${sH}px` }}>
                        <div className="absolute -top-6 left-0 flex items-center gap-1 bg-blue-500 text-white text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-t-lg opacity-0 group-hover/area:opacity-100 transition-opacity">
                          {t(area.nameKey)}
                        </div>
                        {activeProduct.designs.filter(d => d.areaId === area.id).map(design => (
                          <div key={design.id} className="absolute cursor-move" style={{ left: `${(design.x / (area.widthCm * CM_TO_PX)) * 100}%`, top: `${(design.y / (area.heightCm * CM_TO_PX)) * 100}%`, width: `${(design.width / (area.widthCm * CM_TO_PX)) * 100}%`, height: `${(design.height / (area.heightCm * CM_TO_PX)) * 100}%`, transform: `rotate(${design.rotation}deg)` }} onMouseDown={e => handleMouseDown(e, design.id)}>
                            <img src={design.src} className="w-full h-full object-contain pointer-events-none drop-shadow-xl" />
                          </div>
                        ))}
                      </div>
                    )
                  }
                  return null
                })}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR ZONE */}
        <aside className="space-y-6">
          <Tabs defaultValue="areas" className="w-full">
            <TabsList className="w-full bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-sm h-14">
              <TabsTrigger value="areas" className="flex-1 rounded-xl h-full text-[11px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-amber-600">
                <Layout className="w-4 h-4" /> {t('areas')}
              </TabsTrigger>
              <TabsTrigger value="design" className="flex-1 rounded-xl h-full text-[11px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-blue-600">
                <Palette className="w-4 h-4" /> {t('config')}
              </TabsTrigger>
              <TabsTrigger value="inks" className="flex-1 rounded-xl h-full text-[11px] font-black uppercase tracking-widest gap-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600">
                <Settings2 className="w-4 h-4" /> {t('inks')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="areas" className="pt-6 space-y-6 animate-in fade-in slide-in-from-right-4">
              {/* Neck Distances & Production Measurements */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                  <Ruler className="w-5 h-5 text-amber-500" />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em]">{t('production')}</h4>
                </div>

                <div className="space-y-6">
                  {activeProduct.type === 'tote' ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center"><Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('distBottom')}</Label><span className="text-[12px] font-black bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{activeProduct.neckDistanceFrontCm} CM</span></div>
                      <Slider value={[activeProduct.neckDistanceFrontCm]} onValueChange={([v]) => updateActiveProduct({ neckDistanceFrontCm: v })} min={0} max={20} step={0.5} />
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('distNeckFront')}</Label><span className="text-[12px] font-black bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{activeProduct.neckDistanceFrontCm} CM</span></div>
                        <Slider value={[activeProduct.neckDistanceFrontCm]} onValueChange={([v]) => updateActiveProduct({ neckDistanceFrontCm: v })} min={4} max={20} step={0.5} />
                      </div>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center"><Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('distNeckBack')}</Label><span className="text-[12px] font-black bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{activeProduct.neckDistanceBackCm} CM</span></div>
                        <Slider value={[activeProduct.neckDistanceBackCm]} onValueChange={([v]) => updateActiveProduct({ neckDistanceBackCm: v })} min={2} max={15} step={0.5} />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Printing Zones List */}
              <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                {productDef.areas.map(area => {
                  const isActive = activeProduct.activePrintAreas.includes(area.id)
                  const design = activeProduct.designs.find(d => d.areaId === area.id)
                  return (
                    <div key={area.id} className={`p-4 rounded-2xl border-2 transition-all ${isActive ? 'border-amber-500 bg-amber-50/30' : 'border-transparent hover:bg-slate-50'}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              const newAreas = isActive ? activeProduct.activePrintAreas.filter(a => a !== area.id) : [...activeProduct.activePrintAreas, area.id]
                              updateActiveProduct({ activePrintAreas: newAreas })
                            }}
                            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${isActive ? 'bg-amber-500 border-amber-500 shadow-lg shadow-amber-500/20' : 'border-slate-200 bg-white'}`}
                          >
                            {isActive && <Check className="w-4 h-4 text-white" />}
                          </button>
                          <div>
                            <span className="text-xs font-black uppercase tracking-widest block leading-none">{t(area.nameKey)}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">{area.widthCm}x{area.heightCm} CM</span>
                          </div>
                        </div>
                      </div>

                      {isActive && (
                        <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                          <div className="space-y-3 p-3 bg-white rounded-xl border border-slate-100 shadow-inner">
                            <div className="space-y-2">
                              <div className="flex justify-between items-center"><Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('posVertical')}</Label><span className="text-[10px] font-black text-slate-900">{activeProduct.areaYOffsets[area.id] || 0} CM</span></div>
                              <Slider value={[activeProduct.areaYOffsets[area.id] || 0]} onValueChange={([v]) => updateActiveProduct({ areaYOffsets: { ...activeProduct.areaYOffsets, [area.id]: v } })} min={-10} max={30} step={0.5} />
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center"><Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('posHorizontal')}</Label><span className="text-[10px] font-black text-slate-900">{activeProduct.areaXOffsets[area.id] || 0} CM</span></div>
                              <Slider value={[activeProduct.areaXOffsets[area.id] || 0]} onValueChange={([v]) => updateActiveProduct({ areaXOffsets: { ...activeProduct.areaXOffsets, [area.id]: v } })} min={-20} max={20} step={0.5} />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <input type="file" ref={el => { areaFileInputRefs.current[area.id] = el }} className="hidden" accept="image/*" onChange={e => handleImageUploadForArea(e, area.id)} />
                            <Button variant="secondary" size="sm" className="flex-1 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10" onClick={() => areaFileInputRefs.current[area.id]?.click()}>
                              <Upload className="w-4 h-4 mr-2 text-blue-400" /> {design ? t('change') : t('upload')}
                            </Button>
                          </div>

                          {design && (
                            <div className="flex items-center gap-3 p-2.5 bg-white rounded-xl border border-amber-200/50 shadow-sm animate-in zoom-in-95">
                              <div className="w-10 h-10 bg-slate-50 rounded-lg p-1 border border-slate-100 flex-shrink-0">
                                <img src={design.src} className="w-full h-full object-contain" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block truncate">Diseño Activo</span>
                                <span className="text-[10px] font-bold text-slate-700 block truncate">{design.widthCm.toFixed(1)} x {design.heightCm.toFixed(1)} CM</span>
                              </div>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg" onClick={() => deleteDesign(design.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="design" className="pt-6 space-y-6 animate-in fade-in slide-in-from-right-4">
              {/* Product Meta */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-1">
                  <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100">
                    <Type className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('mockupName')}</Label>
                    <Input
                      placeholder="Ej: Camiseta Diseño Final"
                      value={activeProduct.customName || ""}
                      onChange={(e) => updateActiveProduct({ customName: e.target.value })}
                      className="text-sm font-bold border-0 p-0 h-auto focus-visible:ring-0 mt-1 placeholder:text-slate-300"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t('garmentColor')}</Label>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">{getShirtColorName(activeProduct)}</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {BASIC_COLORS.map(c => {
                      const isSelected = activeProduct.shirtColor === c.value
                      return (
                        <button key={c.value} onClick={() => updateActiveProduct({ shirtColor: c.value, shirtColorName: c.name })} className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 hover:z-[60] relative group ${isSelected ? 'border-slate-950 shadow-xl scale-110 z-10' : 'border-white ring-1 ring-slate-100 hover:ring-slate-300'}`} style={{ backgroundColor: c.value }}>
                          {isSelected && <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-[1px]"><Check className={`w-4 h-4 ${c.value === '#ffffff' || c.value === '#e8e0d5' ? 'text-slate-900' : 'text-white'} drop-shadow-md`} /></div>}
                          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[70] uppercase tracking-widest">{c.name}</div>
                        </button>
                      )
                    })}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="relative w-12 h-10 overflow-hidden rounded-xl border-2 border-slate-100 ring-1 ring-slate-100">
                      <Input type="color" value={customColor} onChange={e => setCustomColor(e.target.value)} className="absolute -inset-2 w-[160%] h-[160%] cursor-pointer p-0 border-0" />
                    </div>
                    <Input
                      placeholder="Nombre Color Personalizado"
                      value={activeProduct.shirtColorName || ""}
                      onChange={(e) => updateActiveProduct({ shirtColorName: e.target.value })}
                      className="flex-1 text-xs font-bold bg-slate-50 border-slate-100 rounded-xl focus:bg-white transition-all"
                    />
                    <Button onClick={() => updateActiveProduct({ shirtColor: customColor })} variant="secondary" className="font-black text-[10px] uppercase tracking-widest rounded-xl bg-slate-900 text-white hover:bg-slate-800 px-4">{t('applyHex')}</Button>
                  </div>
                </div>
              </div>

              {/* Selected Design Controls */}
              {selectedDesignId && (
                <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
                  {(() => {
                    const design = activeProduct.designs.find(d => d.id === selectedDesignId);
                    if (!design) return null;
                    const area = productDef.areas.find(a => a.id === design.areaId);
                    if (!area) return null;
                    return (
                      <>
                        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-lg">
                              <img src={design.src} className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <Label className="text-[11px] font-black text-blue-400 uppercase tracking-widest">{t(area.nameKey)}</Label>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">{design.widthCm.toFixed(1)} x {design.heightCm.toFixed(1)} CM</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all" onClick={() => deleteDesign(selectedDesignId)}>
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>

                        <div className="space-y-5 pt-1">
                          <div className="space-y-3">
                            <div className="flex justify-between items-end">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('width')} (cm)</Label>
                              <span className="text-[12px] font-black text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{design.widthCm.toFixed(1)}</span>
                            </div>
                            <Slider value={[design.widthCm]} onValueChange={([v]) => updateDesign(selectedDesignId, { widthCm: v })} min={1} max={area.widthCm} step={0.1} className="py-2" />
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-end">
                              <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('rotation')}</Label>
                              <span className="text-[12px] font-black text-white bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">{design.rotation}°</span>
                            </div>
                            <Slider value={[design.rotation]} onValueChange={([v]) => updateDesign(selectedDesignId, { rotation: v })} min={-180} max={180} step={1} className="py-2" />
                          </div>

                          <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="secondary" className="h-11 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-black text-[10px] uppercase tracking-widest gap-2" onClick={() => centerDesign(design.id)}>
                              <AlignCenter className="w-4 h-4 text-blue-500" /> {t('center')}
                            </Button>
                            <Button variant="secondary" className="h-11 rounded-xl bg-slate-800 text-white hover:bg-slate-700 font-black text-[10px] uppercase tracking-widest gap-2">
                              <Maximize2 className="w-4 h-4 text-amber-500" /> Reset
                            </Button>
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </TabsContent>

            <TabsContent value="inks" className="pt-6 space-y-6 animate-in fade-in slide-in-from-right-4">
              {/* Marser Inks Collection */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-indigo-500" />
                    <Label className="text-xs font-black uppercase tracking-[0.2em]">{t('marserInks')}</Label>
                  </div>
                  <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100 ring-4 ring-indigo-50/50">{activeProduct.printColors.length} TINTAS</span>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {MARSER_COLORS.map(c => {
                    const isSelected = activeProduct.printColors.some(pc => pc.pantone === c.pantone)
                    return (
                      <button
                        key={c.pantone}
                        onClick={() => {
                          const newInks = isSelected ? activeProduct.printColors.filter(pc => pc.pantone !== c.pantone) : [...activeProduct.printColors, { id: Date.now().toString(), ...c }]
                          updateActiveProduct({ printColors: newInks })
                        }}
                        className={`w-full aspect-square rounded-xl border-2 transition-all hover:scale-110 hover:z-[60] relative group ${isSelected ? 'border-slate-950 shadow-xl scale-110 z-10' : 'border-white ring-1 ring-slate-100 hover:ring-slate-300'}`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {isSelected && <div className="absolute inset-0 flex items-center justify-center bg-white/20 rounded-xl backdrop-blur-[1px]"><Check className="w-4 h-4 text-slate-900 drop-shadow-md" /></div>}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-[70] uppercase tracking-widest">{c.name}</div>
                      </button>
                    )
                  })}
                </div>

                {/* Custom Pantone Input */}
                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('customPantone')}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold text-slate-500 ml-1 uppercase">{t('name')}</Label>
                      <Input placeholder="Ej: Especial" value={newColorName} onChange={e => setNewColorName(e.target.value)} className="text-xs font-bold bg-slate-50 border-slate-100 rounded-xl h-10" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[9px] font-bold text-slate-500 ml-1 uppercase">Pantone</Label>
                      <Input placeholder="Ej: 485 C" value={newColorPantone} onChange={e => setNewColorPantone(e.target.value)} className="text-xs font-bold bg-slate-50 border-slate-100 rounded-xl h-10" />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="relative w-12 h-10 overflow-hidden rounded-xl border-2 border-slate-100 ring-1 ring-slate-100">
                      <Input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className="absolute -inset-2 w-[160%] h-[160%] cursor-pointer p-0 border-0" />
                    </div>
                    <Button size="sm" className="flex-1 h-10 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/10" onClick={() => { if (newColorPantone) { updateActiveProduct({ printColors: [...activeProduct.printColors, { id: Date.now().toString(), name: newColorName || `Pantone ${newColorPantone}`, pantone: newColorPantone, hex: newColorHex }] }); setNewColorName(""); setNewColorPantone("") } }}>
                      <Plus className="w-4 h-4 mr-2 text-blue-400" /> {t('add')}
                    </Button>
                  </div>
                </div>

                {/* Active Inks List */}
                <div className="space-y-2 pt-2">
                  {activeProduct.printColors.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 group animate-in slide-in-from-left-2">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-lg shadow-sm border border-white" style={{ backgroundColor: c.hex }} />
                        <div>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-bold block leading-none mt-0.5">PANTONE {c.pantone}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all" onClick={() => updateActiveProduct({ printColors: activeProduct.printColors.filter(pc => pc.id !== c.id) })}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </main>
    </div>
  )
}
