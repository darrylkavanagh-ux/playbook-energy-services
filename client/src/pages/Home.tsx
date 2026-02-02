import React from "react";
import { Link } from "wouter";
import Layout from "../components/Layout";

export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-block bg-[#FFD700] border-4 border-black px-4 py-2 font-mono font-bold uppercase mb-6 w-fit neo-shadow">
            v2.0 MVP Live
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-[0.9] mb-8 tracking-tighter">
            Stop <br/>
            <span className="bg-black text-white px-4 decoration-slice">Overpaying</span> <br/>
            For Energy
          </h1>
          <p className="text-xl md:text-2xl font-mono mb-10 max-w-2xl border-l-8 border-[#FFD700] pl-6 py-2">
            The energy market is designed to confuse you. We use 12 AI engines to dismantle your bill and find the truth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/analyze">
              <a className="neo-button text-center text-xl">
                Analyze My Bill
              </a>
            </Link>
            <Link href="/tariffs">
              <a className="bg-white text-black font-bold uppercase tracking-wider border-4 border-black px-6 py-3 neo-shadow transition-all hover:bg-black hover:text-white neo-shadow-hover active:neo-shadow-active text-center text-xl">
                View Live Rates
              </a>
            </Link>
          </div>
        </div>
        
        <div className="lg:col-span-5 relative">
          <div className="aspect-square bg-black border-4 border-black relative overflow-hidden neo-shadow">
             <img 
              src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/GeIwI8JWRGz3rUZ0xjFhoc-img-1_1770035180000_na1fn_aGVyby1pbmR1c3RyaWFs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L0dlSXdJOEpXUkd6M3JVWjB4akZob2MtaW1nLTFfMTc3MDAzNTE4MDAwMF9uYTFmbl9hR1Z5YnkxcGJtUjFjM1J5YVdGcy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=ZvL5qPPCjdXTrheq44KIJDb1WX7e5-R44dVppbJKa530NjsLX1bASpu~FVtcg9HdsICcdhBtu9wpqzsL-vOaYj45QvUxsySZvx2i~r8yyuiJo55eGTLajGsk8uEaLw3hpcXapu~~V7DySyuu~1xHvrch5XFCF10NkVAKmMNihrtesyk389poqGRZL0VUTuIBgPKOBB59CEG9UMgsCSY3Ahlf5nbJyZh6q28CPZHLvWqlZWEu~VNPpJdYNGbea4JrXxPFSkC8CzzyoW2GpOlfi9fZTliEcpoBTORbNR6TDkCqS7IExF-0iwN6kukcG8AYbkT6kHdNkOSuuoyxz5an6A__" 
              alt="Industrial Energy Meter" 
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-[#FFD700] border-t-4 border-black p-4 font-mono font-bold text-xs">
              <div className="flex justify-between items-center">
                <span>SYSTEM STATUS:</span>
                <span className="animate-pulse">● LIVE</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span>ENGINES ACTIVE:</span>
                <span>12/12</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-4 bg-black flex-grow"></div>
          <h2 className="text-4xl font-black uppercase whitespace-nowrap">How It Works</h2>
          <div className="h-4 bg-black flex-grow"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
              <img src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/GeIwI8JWRGz3rUZ0xjFhoc-img-4_1770035171000_na1fn_aWNvbi1iaWxs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L0dlSXdJOEpXUkd6M3JVWjB4akZob2MtaW1nLTRfMTc3MDAzNTE3MTAwMF9uYTFmbl9hV052YmkxaWFXeHMucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Ewi4FHc5qRcJjdJcbgJs2aMcnLJGGkE4X6DSY7alkfAimZvaZJYtwDlZed-Yk0PgO74-CtbsBXPF9ZSNzwG96QR0lSNPfL1d68tjObiGxhMKHkMdNXCYYdq2IaN~M2pehe5Wq-kOKWGW6JGb-VKFrSyFyT68zRLOaGTG2A9tKmPBSsiSjk11uIP2b2EEuBYaOfxAibHTfDdXtlBmp7FrCu6tbylzgQlImLP94qjL0Pu1wR6AVVt2npKXYzsxTq39kKYXhfJiIYzJuCLZEA8xH-vin5xFGs57bDgyk-D02KgjmTiHu3aiKsUUVOwwnJxZpchSZjJ4OTHHJwadC2lqlw__" className="w-10 h-10" alt="Upload Icon"/>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">1. Upload Bill</h3>
            <p className="font-mono text-sm leading-relaxed">
              Drag and drop your confusing PDF bill. Our OCR engine extracts every line item, rate, and hidden charge instantly.
            </p>
          </div>

          {/* Card 2 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
               <img src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/GeIwI8JWRGz3rUZ0xjFhoc-img-3_1770035174000_na1fn_aWNvbi1saWdodG5pbmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L0dlSXdJOEpXUkd6M3JVWjB4akZob2MtaW1nLTNfMTc3MDAzNTE3NDAwMF9uYTFmbl9hV052Ymkxc2FXZG9kRzVwYm1jLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=CZIGU3BoKqugjiBZCa5DfyN3iaK54~bJe9l12oM9GAnMh8rUcgEM5qIeUddiUHoA5V07MmXv-ouhuvyr7~eNk~68aSTgDqKwmdXjqDrMT~h5HsLjIzaXbSkROS23iN-nqxy~5x8Sinq~wlJB2G2VRfDbhfME7RmksnlOCl6l6GkV05iSaXB7eccixihw4ba2Xwl662WokSn0suZusd-GhS~Abpq3hQewcUlTWG2TJxMXsYQCvjqkKlV0rqr4GyJtO4eqeuyRZHic9LRbm811wWHLHUSGaFgdRjSnbzhbr7OIVP1CC6cscj-G3HBKWQuuYXNwNefZYdfT1qG3-cGl2g__" className="w-10 h-10" alt="Analyze Icon"/>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">2. AI Analysis</h3>
            <p className="font-mono text-sm leading-relaxed">
              Our 12-engine stack cross-references your usage against thousands of tariffs to find where you're being ripped off.
            </p>
          </div>

          {/* Card 3 */}
          <div className="neo-card group hover:bg-black hover:text-[#FFD700] transition-colors duration-300">
            <div className="w-16 h-16 mb-6 border-4 border-black bg-[#FFD700] flex items-center justify-center group-hover:bg-white group-hover:border-[#FFD700]">
               <img src="https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/GeIwI8JWRGz3rUZ0xjFhoc-img-5_1770035175000_na1fn_aWNvbi1oYXphcmQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L0dlSXdJOEpXUkd6M3JVWjB4akZob2MtaW1nLTVfMTc3MDAzNTE3NTAwMF9uYTFmbl9hV052Ymkxb1lYcGhjbVEucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=hfWMEmp4pw-A~GjPi~E42iUrKrXqgNveU21xAB8-EkDP0uzDhBeIsaTN8Nl5ccvln9kh-5ZXXd~u02uI4-swNKnXksTMujVO95eObmViW4bxdai5HG06GELRWyjJySr3q5~4469Pn75GZvMNETaCtxZUCwbeNq452TPhFwmEwzG8YiiAw0~jr7zceJPzBvFzC-MO7wdTR7x1TLYyWUJYBj-1Svk5UsSy9O~fkJNmo3~UROZygaAloL7l6gFkMq0g~7JjIYItO8f2-QVMi-0ZqLzhl4sqIlMYka9ky8A3mMpE80iPuJPcfo0J77KrCJvOLP3G4~KVlispRX4YKfN~pQ__" className="w-10 h-10" alt="Switch Icon"/>
            </div>
            <h3 className="text-2xl font-bold uppercase mb-4">3. Switch & Save</h3>
            <p className="font-mono text-sm leading-relaxed">
              We present the cheapest option. No sponsored results. No bias. Just the math. Switch in 2 clicks.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-black text-[#FFD700] border-4 border-black p-8 md:p-12 mb-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'url(https://private-us-east-1.manuscdn.com/sessionFile/4dyvAKY9YMqYpb9KX1sjyk/sandbox/GeIwI8JWRGz3rUZ0xjFhoc-img-2_1770035173000_na1fn_dGV4dHVyZS1jb25jcmV0ZQ.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvNGR5dkFLWTlZTXFZcGI5S1gxc2p5ay9zYW5kYm94L0dlSXdJOEpXUkd6M3JVWjB4akZob2MtaW1nLTJfMTc3MDAzNTE3MzAwMF9uYTFmbl9kR1Y0ZEhWeVpTMWpiMjVqY21WMFpRLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=MYY10ZTy-ORz7hy0QUNg-f~lNhO3EIKjO3mup7z13KuelWVJSzX8xZrzL4fgOTVfi0z7Nr4aatDl0qOUL1ltFjuzNLFcDNJmOSo3UolPrxFt1wt7HW~XBG8Obp5Ads9EemjUM8IyakKmifOTEgu4AwZ3ZapMpUE5cDa-u4OoqFJBKVLIIzauojC1plVH5n~oq1x9vtYK999aNt0BP1FwrcWKPLsplee40znGxItZTuNFAosmupQ0SBNW~1L6b4R~4c9YibTkK-eVyIK8Y5nMnYqmvkssR~wRHq3BSA07kWZF7u0FWR4O3wRMGdWzf-m61U847MWXC32SGYmodPhwTw__)' }}></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10 text-center">
          <div className="border-r-0 md:border-r-4 border-white/20 last:border-r-0">
            <div className="text-5xl font-black mb-2">€2M+</div>
            <div className="font-mono text-sm uppercase tracking-widest">Potential Damages Found</div>
          </div>
          <div className="border-r-0 md:border-r-4 border-white/20 last:border-r-0">
            <div className="text-5xl font-black mb-2">12</div>
            <div className="font-mono text-sm uppercase tracking-widest">Active Engines</div>
          </div>
          <div className="border-r-0 md:border-r-4 border-white/20 last:border-r-0">
            <div className="text-5xl font-black mb-2">100%</div>
            <div className="font-mono text-sm uppercase tracking-widest">Market Coverage</div>
          </div>
          <div>
            <div className="text-5xl font-black mb-2">0.0s</div>
            <div className="font-mono text-sm uppercase tracking-widest">Bias</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8">Ready to reclaim your money?</h2>
        <Link href="/analyze">
          <a className="neo-button inline-block text-2xl px-12 py-6">
            Start Analysis Protocol
          </a>
        </Link>
      </section>
    </Layout>
  );
}
