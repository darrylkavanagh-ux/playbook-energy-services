import React from 'react';
import { NeoButton, NeoCard, NeoInput } from './components/ui/NeoBrutalist';
import { Upload, Zap, DollarSign, ArrowRight, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-off-white font-sans selection:bg-electric-yellow selection:text-stark-black">
      
      {/* --- MARQUEE HEADER --- */}
      <div className="bg-stark-black text-electric-yellow py-2 overflow-hidden whitespace-nowrap border-b-4 border-stark-black">
        <div className="animate-marquee inline-block font-mono font-bold uppercase tracking-widest">
          BREAK THE BILL /// NO HIDDEN FEES /// STOP OVERPAYING /// ENERGY REVOLUTION /// BREAK THE BILL /// NO HIDDEN FEES /// STOP OVERPAYING /// ENERGY REVOLUTION ///
        </div>
      </div>

      {/* --- HERO SECTION --- */}
      <header className="relative border-b-4 border-stark-black bg-electric-yellow overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: `url('https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/wGInt5cM5cjN56kz5GhJvs-img-4_1770034728000_na1fn_ZGF0YS1ncmlkLWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L3dHSW50NWNNNWNqTjU2a3o1R2hKdnMtaW1nLTRfMTc3MDAzNDcyODAwMF9uYTFmbl9aR0YwWVMxbmNtbGtMV0puLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QbC4gWdGrkd3CF8KMEpfTZoHVY4aRA-3y-LdFwjwOBcpXjqtThbov-xR7GkYvcK6lljNEdcJtwbrPOC3oR23c0ffabKm99LgLTt6ZEOHvUnJYtWBj~MfiGRQbxS0PZ5~E61bwUdf5mflq2QuU3NlC-zBGXk~ICwDFzcIQSe-Sr2pNqusQuXXI55VfncznnnfYH5fgU6spMGWWpUbKD-N-qVEt6bAcjei7BCoq5FfNY1~Ne6IckFqEMx0eIZUwj-WAWbshBQs93js2dnv2owjkjPdEinuypc1TgmAPl6K528Y3ZyG3kyugvLiZcLEBeicEJ2jgSnnD2Sh50mKJceDgQ__')`, backgroundSize: 'cover' }}>
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">
              Break<br/>The Bill
            </h1>
            <p className="text-xl md:text-2xl font-mono font-bold bg-white inline-block px-4 py-2 border-2 border-stark-black shadow-neo">
              Stop overpaying. Start saving. Now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <NeoButton size="lg" className="flex items-center gap-2 group">
                <Upload className="w-6 h-6" />
                Upload Bill
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </NeoButton>
              <NeoButton variant="secondary" size="lg">
                How It Works
              </NeoButton>
            </div>
          </div>
          
          <div className="hidden md:block relative">
             <img 
               src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/wGInt5cM5cjN56kz5GhJvs_1770034758177_na1fn_aGVyby1iYW5uZXI.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L3dHSW50NWNNNWNqTjU2a3o1R2hKdnNfMTc3MDAzNDc1ODE3N19uYTFmbl9hR1Z5YnkxaVlXNXVaWEkucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=vDZSmQ2aRQ2fc01FAhM2Hoq6CpdGf-rgiNWsS6kHyO7ZiW3Iusgzt7jJ3iVkG004qQiXTsg3p0jjoxUhv2SNhQ2hHZVgxlgwRaf5LG1gA-Nk8RLGj4xwuhMdXbJfqX~WlRLVc4MQuRR-tpRWUbuGR5PvO0gMtLiMjZkcA4rfQdacVNL5WEsugob4uw23VE5k0X2dCsppSc-xJnQP-ozi9h6~J4Hr3QCN~GtVYsXM-DlWEE9iEJDjHAlyMrfcCESLqvxwtWKz0K4I9LeN0fM2crgN5Oan8n0JL2kdZ2PXASUgLot~BHluwdEe1zAsi07iWT241Zzd7YorIFVY1fhsUQ__" 
               alt="Break the Bill" 
               className="w-full h-auto border-4 border-stark-black shadow-neo-deep rotate-2 hover:rotate-0 transition-transform duration-300"
             />
          </div>
        </div>
      </header>

      {/* --- FEATURES SECTION --- */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <NeoCard title="1. SCAN" className="bg-white">
            <img src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/wGInt5cM5cjN56kz5GhJvs_1770034758178_na1fn_ZmVhdHVyZS1zY2Fu.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L3dHSW50NWNNNWNqTjU2a3o1R2hKdnNfMTc3MDAzNDc1ODE3OF9uYTFmbl9abVZoZEhWeVpTMXpZMkZ1LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=RKJRu1QuSWz-rMsN3jtiFgcQ3CbugM3udsLeYszn-As6Tvaix586FAgKfq66T7gnCFvM4QTdikL0Tx9FBxSAZIfFw-z3v53jx0ckApaZJKpZr0jlT8PKdLzagBJEjlYm9W6GDa6XJgw6OAgzn0QJ~VSM5Y1buSMj17HV4wWSHQ4MoPVXoNMGKB9bocBPMLHWj7y2pTFcr8S5VygWAw0VzD0ZmlTDOAr-01dnZv3uVF-5OQPaAS6ZDGZTcpzz6J~5G47MIcYHVTnm0a4eCjsBu7aZpaXROHAbGVCWJxMd8vt7fjrHcAvC2oB2gk9JOkFCZAHtKOmzMUm8TMNX6yvqsQ__" className="w-full h-48 object-cover border-b-4 border-stark-black mb-4 grayscale hover:grayscale-0 transition-all" />
            <p className="mb-4">Upload your PDF or take a photo. Our AI rips the data out instantly.</p>
            <div className="flex items-center gap-2 text-safety-orange font-bold">
              <Zap className="w-5 h-5" /> FAST
            </div>
          </NeoCard>

          <NeoCard title="2. ANALYZE" className="bg-white">
             <div className="h-48 bg-industrial-grey border-b-4 border-stark-black mb-4 flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/wGInt5cM5cjN56kz5GhJvs-img-4_1770034728000_na1fn_ZGF0YS1ncmlkLWJn.jpg?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L3dHSW50NWNNNWNqTjU2a3o1R2hKdnMtaW1nLTRfMTc3MDAzNDcyODAwMF9uYTFmbl9aR0YwWVMxbmNtbGtMV0puLmpwZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=QbC4gWdGrkd3CF8KMEpfTZoHVY4aRA-3y-LdFwjwOBcpXjqtThbov-xR7GkYvcK6lljNEdcJtwbrPOC3oR23c0ffabKm99LgLTt6ZEOHvUnJYtWBj~MfiGRQbxS0PZ5~E61bwUdf5mflq2QuU3NlC-zBGXk~ICwDFzcIQSe-Sr2pNqusQuXXI55VfncznnnfYH5fgU6spMGWWpUbKD-N-qVEt6bAcjei7BCoq5FfNY1~Ne6IckFqEMx0eIZUwj-WAWbshBQs93js2dnv2owjkjPdEinuypc1TgmAPl6K528Y3ZyG3kyugvLiZcLEBeicEJ2jgSnnD2Sh50mKJceDgQ__')] bg-cover opacity-50"></div>
                <span className="font-mono text-4xl font-bold text-white relative z-10">ERROR_0%</span>
             </div>
            <p className="mb-4">We check against every tariff in the market. No bias. Pure math.</p>
            <div className="flex items-center gap-2 text-electric-yellow bg-stark-black inline-block px-2">
              <ShieldCheck className="w-5 h-5" /> ACCURATE
            </div>
          </NeoCard>

          <NeoCard title="3. SAVE" className="bg-white">
            <img src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/wGInt5cM5cjN56kz5GhJvs_1770034758178_na1fn_ZmVhdHVyZS1zYXZl.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L3dHSW50NWNNNWNqTjU2a3o1R2hKdnNfMTc3MDAzNDc1ODE3OF9uYTFmbl9abVZoZEhWeVpTMXpZWFpsLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=VfSwJCxigrcMiQnm7P3quvFlPs5ZqlyzuIqYIUQZWd33RT~nAYVsh43EHMbzuJuvQblbazI8eyd1U4UCIHn0aLYXtn6~s8N~UDeXahiJv607lsnPddMrbDkX~juoNvTign0TATX9LUFZRrxmiGU91L2bi9EVGhq957dbbztijsSnneTwPypawxlkOOWN~6eY6J6haGU6bTC8IjtRJV4crkeMwcePPxlVRbvywxnoTp-dcmQQgwX5RW7SLTCF~fHqMS7-bdAJkiKA3KZMdxxI4sGLp9yU4ssutjsPjvpjH44aMR8V~CpxTI2-wbBW5RVHzksW8LzttxAq~CuN9SRSFA__" className="w-full h-48 object-cover border-b-4 border-stark-black mb-4 grayscale hover:grayscale-0 transition-all" />
            <p className="mb-4">Switch in one click. We handle the paperwork. You keep the cash.</p>
            <div className="flex items-center gap-2 text-green-600 font-bold">
              <DollarSign className="w-5 h-5" /> PROFIT
            </div>
          </NeoCard>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="bg-stark-black text-white py-20 border-t-4 border-electric-yellow">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-5xl font-black uppercase mb-8">Ready to break the cycle?</h2>
          <div className="bg-electric-yellow p-8 border-4 border-white shadow-[8px_8px_0px_0px_#ffffff] text-stark-black transform rotate-1 hover:rotate-0 transition-transform duration-300">
            <h3 className="text-2xl font-bold mb-4 uppercase">Get your free analysis</h3>
            <div className="flex flex-col gap-4">
              <NeoInput placeholder="Enter your email address" />
              <NeoButton className="w-full">START NOW</NeoButton>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-off-white border-t-4 border-stark-black py-12">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-black text-2xl uppercase tracking-tighter">NO COMPARE</div>
          <div className="font-mono text-sm text-industrial-grey">
            © 2026 VERITECH ENGINE SUITE. ALL RIGHTS RESERVED.
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
