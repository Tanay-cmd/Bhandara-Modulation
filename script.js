const canvas = document.getElementById('canvas');
      const ctx = canvas.getContext('2d');
    
      function startModulation() {
        const carrierFrequency = parseFloat(document.getElementById('carrierFrequency').value);
        const modulationType = document.getElementById('modulationType').value;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const wave = generateModulatedWave(carrierFrequency, modulationType);
        plotWave(wave);
      }
    
      function generateModulatedWave(carrierFrequency, modulationType) {
        const wave = [];
        if (modulationType === 'am') {

          const messageFrequency = parseFloat(document.getElementById('messageFrequency').value);
          const carrierAmplitude = parseFloat(document.getElementById('carrierAmplitude').value);
          const messageAmplitude = parseFloat(document.getElementById('messageAmplitude').value);
          const samplingTime = parseFloat(document.getElementById('samplingTime').value);

          for (let t = 0; t < canvas.width; t++) {
            const time = t / canvas.width;
            const messageWave = messageAmplitude * Math.cos(2 * Math.PI * messageFrequency * time);
            const carrierWave = carrierAmplitude * Math.cos(2 * Math.PI * carrierFrequency * time);
            const modulatedAmplitude = (1 + messageWave / carrierAmplitude) * carrierWave;
            wave.push(modulatedAmplitude);
          }
        }

        else if (modulationType === 'fm') {
          const messageFrequency = parseFloat(document.getElementById('fmMessageFrequency').value);
          const carrierAmplitude = parseFloat(document.getElementById('fmCarrierAmplitude').value);
          const deviation = parseFloat(document.getElementById('deviation').value);
          const samplingTime = parseFloat(document.getElementById('fmSamplingTime').value);

          for (let t = 0; t < canvas.width; t++) {
            const time = t / canvas.width;
            const beta = deviation;
            const modulatedFrequency = carrierAmplitude * Math.cos((2 * Math.PI * carrierFrequency * time) + (beta * Math.sin(2 * Math.PI * messageFrequency * time))); 
            wave.push(modulatedFrequency);
          }
        } 

        else if (modulationType === 'pm') {
          const messageFrequency = parseFloat(document.getElementById('pmMessageFrequency').value);
          const carrierAmplitude = parseFloat(document.getElementById('pmCarrierAmplitude').value);
          const deviation = parseFloat(document.getElementById('pmDeviation').value);
          const samplingTime = parseFloat(document.getElementById('pmSamplingTime').value);
        
          for (let t = 0; t < canvas.width; t++) {
            const time = t / canvas.width;
            const modulatedPhase = carrierAmplitude * Math.cos((2 * Math.PI * carrierFrequency * time) + (deviation * Math.cos(2 * Math.PI * messageFrequency * time)));
            wave.push(modulatedPhase);
          }
        } 

        else if (modulationType === 'ask') {
          const bitRate = parseFloat(document.getElementById('askBitRate').value);
          const carrierFrequency = parseFloat(document.getElementById('carrierFrequency').value);
          const amplitude = parseFloat(document.getElementById('askAmplitude').value);
          const bitDuration = 1 / bitRate;
          let currentValue = 0;
        
          for (let t = 0; t < canvas.width; t++) {
            const time = t / canvas.width;
            const bitIndex = Math.floor(time / bitDuration);
            const bitValue = (bitIndex % 2 === 0) ? 0 : 1;
            currentValue = bitValue * amplitude;
            const modulatedAmplitude = currentValue * Math.cos(2 * Math.PI * carrierFrequency * time);
            wave.push(modulatedAmplitude);
          }
        } 

        else if (modulationType === 'fsk') {
          const bitRate = parseFloat(document.getElementById('fskBitRate').value);
          const frequency1 = parseFloat(document.getElementById('fskFrequency1').value);
          const frequency2 = parseFloat(document.getElementById('fskFrequency2').value);
          const bitDuration = 1 / bitRate;
          let currentValue = 0;
        
          for (let t = 0; t < canvas.width; t++) {
            const time = t / canvas.width;
            const bitIndex = Math.floor(time / bitDuration);
            const bitValue = (bitIndex % 2 === 0) ? 0 : 1;
            currentValue = (bitValue === 0) ? frequency1 : frequency2;
            const modulatedFrequency = Math.cos(2 * Math.PI * currentValue * time);
            wave.push(modulatedFrequency);
          }
        }

        else if (modulationType === 'psk') {
          const bitRate = parseFloat(document.getElementById('pskBitRate').value);
          const carrierFrequency = parseFloat(document.getElementById('carrierFrequency').value);
          const phase = parseFloat(document.getElementById('pskPhase').value);
          const bitDuration = 1 / bitRate;
          let currentValue = 0;
        
          for (let t = 0; t < canvas.width; t++) {
            const time = t / canvas.width;
            const bitIndex = Math.floor(time / bitDuration);
            const bitValue = (bitIndex % 2 === 0) ? 0 : 1;
            currentValue = (bitValue === 0) ? phase : (phase + 180) % 360;
            const modulatedPhase = Math.cos(2 * Math.PI * carrierFrequency * time + (currentValue * Math.PI / 180));
            wave.push(modulatedPhase);
          }
        }

        return wave;
      }
    
      function plotWave(wave) {
        const height = canvas.height;
        const centerY = height / 2;
        const amplitude = Math.max.apply(null, wave);
        const scaleFactor = centerY / amplitude;
    
        // Draw gridlines
        drawGridlines(50, 'rgba(0, 0, 0, 0.5)', 1);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#B583F0';
        ctx.beginPath();
        ctx.moveTo(0, centerY);
    
        for (let t = 0; t < canvas.width; t++) {
            const value = wave[t];
            const x = t;
            const y = centerY - (value * scaleFactor);
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Function to draw gridlines
    function drawGridlines(gridSize, color, lineWidth) {
        gridSize = gridSize || 50;
        color = 'rgba(0, 0, 0, 0.2)';
        lineWidth = lineWidth || 1;
    
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
    
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
    
        for (let x = gridSize; x < canvasWidth; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvasHeight);
        }
    
        for (let y = gridSize; y < canvasHeight; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvasWidth, y);
        }
    
        ctx.stroke();
    }
    
    
      function handleModulationTypeChange() {
        const modulationType = document.getElementById('modulationType').value;
        document.getElementById('amInputs').style.display = 'none';
        document.getElementById('fmInputs').style.display = 'none';
        document.getElementById('pmInputs').style.display = 'none';
        document.getElementById('askInputs').style.display = 'none';
        document.getElementById('fskInputs').style.display = 'none';
        document.getElementById('pskInputs').style.display = 'none';
      
      
        if (modulationType === 'am') {
          document.getElementById('amInputs').style.display = 'block';
        } 

        else if (modulationType === 'fm') {
          document.getElementById('fmInputs').style.display = 'block';
        } 

        else if (modulationType === 'pm') {
          document.getElementById('pmInputs').style.display = 'block';
        } 
      
        else if (modulationType === 'ask') {
          document.getElementById('askInputs').style.display = 'block';
        } 

        else if (modulationType === 'fsk') {
          document.getElementById('fskInputs').style.display = 'block';
        } 

        else if (modulationType === 'psk') {
        document.getElementById('pskInputs').style.display = 'block';
        }
      } 