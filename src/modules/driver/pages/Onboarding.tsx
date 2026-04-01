import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bike, Car, Truck, User, Camera, ArrowRight, CheckCircle2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { useFileUpload } from '../hooks/useFileUpload';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    phone: '',
    email: '',
    vehicle: 'moto',
    radius: 5,
  });
  const navigate = useNavigate();

  const cnhUpload = useFileUpload({ accept: ['image/jpeg', 'image/png'] });
  const profileUpload = useFileUpload({ accept: ['image/jpeg', 'image/png'] });

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.cpf) {
        toast.error('Preencha todos os campos obrigatórios');
        return;
      }
    }

    if (step === 3) {
      if (!cnhUpload.file || !profileUpload.file) {
        toast.error('Faça o upload dos documentos obrigatórios');
        return;
      }
    }

    if (step < 3) setStep(step + 1);
    else {
      toast.success('Cadastro enviado para análise!');
      navigate('/');
    }
  };

  const vehicleOptions = [
    { id: 'moto', icon: Bike, label: 'Moto' },
    { id: 'bicicleta', icon: Bike, label: 'Bicicleta' },
    { id: 'carro', icon: Car, label: 'Carro' },
    { id: 'a_pe', icon: User, label: 'A pé' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white p-6 flex flex-col justify-center max-w-md mx-auto">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between mb-2 px-1">
          {[1, 2, 3].map((s) => (
            <span key={s} className={`text-xs font-bold uppercase tracking-widest ${step >= s ? 'text-[#FF6B00]' : 'text-white/20'}`}>
              Etapa {s}
            </span>
          ))}
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#FF6B00]"
            initial={{ width: '33.33%' }}
            animate={{ width: `${step * 33.33}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h1 className="text-3xl font-bold tracking-tight">Seja bem-vindo ao <span className="text-[#FF6B00]">Time</span></h1>
            <p className="text-white/60">Complete seu cadastro para começar a faturar hoje mesmo.</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Nome Completo</label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">CPF</label>
                <input
                  type="text"
                  placeholder="000.000.000-00"
                  className="w-full bg-[#1A1A1A] border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                />
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold tracking-tight">Como você vai <span className="text-[#FF6B00]">entregar</span>?</h2>
            <div className="grid grid-cols-2 gap-4">
              {vehicleOptions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setFormData({ ...formData, vehicle: v.id })}
                  className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-3 ${
                    formData.vehicle === v.id ? 'border-[#FF6B00] bg-[#FF6B00]/10' : 'border-white/5 bg-[#1A1A1A]'
                  }`}
                >
                  <v.icon size={32} className={formData.vehicle === v.id ? 'text-[#FF6B00]' : 'text-white/40'} />
                  <span className="font-bold text-sm">{v.label}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2 pt-4">
              <label className="text-xs font-bold uppercase tracking-wider text-white/40 ml-1">Raio de Atuação (km)</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="30"
                  className="flex-1 accent-[#FF6B00]"
                  value={formData.radius}
                  onChange={(e) => setFormData({ ...formData, radius: parseInt(e.target.value) })}
                />
                <span className="font-bold text-[#FF6B00] w-12">{formData.radius}km</span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold tracking-tight">Quase <span className="text-[#FF6B00]">lá</span>!</h2>
            <p className="text-white/60">Precisamos de uma foto dos seus documentos para validação.</p>
            
            <div className="grid gap-4">
              {/* CNH Upload */}
              <div className="relative">
                <input
                  type="file"
                  id="cnh-upload"
                  className="hidden"
                  onChange={cnhUpload.handleChange}
                  accept="image/jpeg,image/png"
                />
                <label
                  htmlFor="cnh-upload"
                  className={`flex items-center justify-between p-6 bg-[#1A1A1A] border rounded-3xl group transition-all cursor-pointer ${
                    cnhUpload.file ? 'border-[#FF6B00]/50' : 'border-white/5 hover:border-[#FF6B00]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${
                      cnhUpload.file ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'bg-white/5 group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00]'
                    }`}>
                      {cnhUpload.preview ? (
                        <img src={cnhUpload.preview} alt="CNH Preview" className="w-6 h-6 object-cover rounded" />
                      ) : (
                        <Camera size={24} />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{cnhUpload.file ? cnhUpload.file.name : 'Foto da CNH'}</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest">
                        {cnhUpload.file ? 'Arquivo selecionado' : 'Obrigatório'}
                      </p>
                    </div>
                  </div>
                  {cnhUpload.file ? (
                    <button onClick={(e) => { e.preventDefault(); cnhUpload.clear(); }} className="p-2 text-white/20 hover:text-red-500">
                      <X size={20} />
                    </button>
                  ) : (
                    <Upload size={20} className="text-white/20" />
                  )}
                </label>
                {cnhUpload.error && <p className="text-red-500 text-xs mt-2 ml-2">{cnhUpload.error}</p>}
              </div>
              
              {/* Profile Photo Upload */}
              <div className="relative">
                <input
                  type="file"
                  id="profile-upload"
                  className="hidden"
                  onChange={profileUpload.handleChange}
                  accept="image/jpeg,image/png"
                />
                <label
                  htmlFor="profile-upload"
                  className={`flex items-center justify-between p-6 bg-[#1A1A1A] border rounded-3xl group transition-all cursor-pointer ${
                    profileUpload.file ? 'border-[#FF6B00]/50' : 'border-white/5 hover:border-[#FF6B00]/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl transition-colors ${
                      profileUpload.file ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'bg-white/5 group-hover:bg-[#FF6B00]/10 group-hover:text-[#FF6B00]'
                    }`}>
                      {profileUpload.preview ? (
                        <img src={profileUpload.preview} alt="Profile Preview" className="w-6 h-6 object-cover rounded-full" />
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold">{profileUpload.file ? profileUpload.file.name : 'Foto de Perfil'}</p>
                      <p className="text-xs text-white/40 uppercase tracking-widest">
                        {profileUpload.file ? 'Arquivo selecionado' : 'Obrigatório'}
                      </p>
                    </div>
                  </div>
                  {profileUpload.file ? (
                    <button onClick={(e) => { e.preventDefault(); profileUpload.clear(); }} className="p-2 text-white/20 hover:text-red-500">
                      <X size={20} />
                    </button>
                  ) : (
                    <Upload size={20} className="text-white/20" />
                  )}
                </label>
                {profileUpload.error && <p className="text-red-500 text-xs mt-2 ml-2">{profileUpload.error}</p>}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleNext}
        className="mt-12 w-full bg-[#FF6B00] hover:bg-[#FF8533] text-white font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-[#FF6B00]/20"
      >
        {step === 3 ? 'Finalizar Cadastro' : 'Continuar'}
        <ArrowRight size={20} />
      </button>
    </div>
  );
};

export default Onboarding;
