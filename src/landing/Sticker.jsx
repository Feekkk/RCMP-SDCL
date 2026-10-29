import { motion, useMotionValue, useTransform } from 'motion/react'
import StickerArt from './StickerArt.jsx'

const POP_IN = { type: 'spring', stiffness: 260, damping: 15 }
const SNAPPY = { type: 'spring', stiffness: 420, damping: 14 }

// Dragging is a mouse toy; on touch screens it would trap page scrolling.
const CAN_DRAG = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

// A draggable die-cut sticker. The outer layer handles placement, pop-in and pointer
// parallax; the inner layer handles hover, drag and snapping back; the art bobs via CSS.
export default function Sticker({ name, label, size = 140, rotate = 0, x, y, depth = 0, pointer, delay = 0, className = '' }) {
  const still = useMotionValue(0)
  const shiftX = useTransform(pointer?.x ?? still, (value) => value * depth)
  const shiftY = useTransform(pointer?.y ?? still, (value) => value * depth)

  return (
    <motion.div
      className={`sticker ${className}`}
      style={{ '--size': `${size}px`, '--x': x, '--y': y, x: shiftX, y: shiftY }}
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ ...POP_IN, delay }}
    >
      <motion.div
        className="sticker-drag"
        style={{ rotate }}
        drag={CAN_DRAG}
        dragSnapToOrigin
        dragElastic={0.5}
        whileHover={{ scale: 1.08, rotate: rotate + 7 }}
        whileDrag={{ scale: 1.14, rotate: rotate - 5 }}
        transition={SNAPPY}
      >
        <div className="sticker-bob" style={{ animationDelay: `${-delay * 4}s` }}>
          <div className="sticker-art">
            <StickerArt name={name} />
          </div>
          {label && <span className="sticker-label">{label}</span>}
        </div>
      </motion.div>
    </motion.div>
  )
}
