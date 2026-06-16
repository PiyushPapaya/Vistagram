'use client'

import { useState, useRef } from 'react'
import { X, Image, ArrowLeft, ArrowRight } from 'lucide-react'
import { useStore } from '@/lib/store'

type Step = 'select' | 'crop' | 'caption'

export function CreateModal() {
  const { setCreateOpen } = useStore()
  const [step, setStep] = useState<Step>('select')
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setStep('crop')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    setStep('crop')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setCreateOpen(false)}>
      <div
        className="bg-background rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ width: 348 + (step !== 'select' ? 300 : 0), maxWidth: '95vw', minHeight: 430 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          {step !== 'select' && (
            <button onClick={() => setStep(step === 'caption' ? 'crop' : 'select')}>
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          {step === 'select' && <div />}
          <p className="font-semibold text-sm text-center flex-1">
            {step === 'select' ? 'Create new post' : step === 'crop' ? 'Crop' : 'Create new post'}
          </p>
          {step === 'select' ? (
            <button onClick={() => setCreateOpen(false)}><X className="h-5 w-5" /></button>
          ) : step === 'crop' ? (
            <button className="text-[#0095f6] text-sm font-semibold" onClick={() => setStep('caption')}>Next</button>
          ) : (
            <button className="text-[#0095f6] text-sm font-semibold" onClick={() => setCreateOpen(false)}>Share</button>
          )}
        </div>

        {step === 'select' && (
          <div
            className="flex flex-col items-center justify-center flex-1 gap-4 p-8 cursor-pointer"
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
          >
            <div className="rounded-full bg-accent p-5">
              <Image className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-xl font-light mb-1">Drag photos and videos here</p>
              <button className="mt-2 rounded-lg bg-[#0095f6] text-white text-sm font-semibold px-4 py-1.5">
                Select from computer
              </button>
            </div>
            <input ref={inputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFile} />
          </div>
        )}

        {(step === 'crop' || step === 'caption') && preview && (
          <div className="flex flex-1">
            {/* Image preview */}
            <div className="w-[348px] h-[430px] bg-black flex items-center justify-center shrink-0">
              <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
            </div>
            {/* Caption panel */}
            {step === 'caption' && (
              <div className="w-[300px] flex flex-col border-l border-border">
                <div className="flex items-center gap-3 p-3 border-b border-border">
                  <img src="https://i.pravatar.cc/150?img=1" alt="avatar" className="h-7 w-7 rounded-full" />
                  <span className="text-sm font-semibold">alice_v</span>
                </div>
                <textarea
                  autoFocus
                  value={caption}
                  onChange={e => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="flex-1 resize-none bg-transparent p-3 text-sm outline-none placeholder:text-muted-foreground"
                  rows={8}
                />
                <div className="border-t border-border p-3 text-xs text-muted-foreground flex justify-between">
                  <span>{caption.length}/2,200</span>
                </div>
                <div className="border-t border-border">
                  {[
                    { label: 'Add location' },
                    { label: 'Tag people' },
                    { label: 'Add music' },
                    { label: 'Advanced settings' },
                  ].map(({ label }) => (
                    <button key={label} className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-accent border-b border-border last:border-0">
                      {label}
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
