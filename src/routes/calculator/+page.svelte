<script lang="ts">
	import { onMount } from 'svelte';

	// Input variables with reactive declarations
	let kaufpreis = 300000;
	let eigenkapital = 200000;
	let mietpreis = 170;
	let wohnflaeche = 60;
	const belegungsrate = 0.5; // 50%
	const buchungsdauer = 3; // 3 days per booking

	// Reactive calculations
	$: instandhaltungKosten = 12.5 * wohnflaeche;
	$: reinigungskosten = 0.4 * wohnflaeche;
	$: provision = 0.2;
	$: availability = (365 - 4 * 7 - ((365 * belegungsrate) / buchungsdauer) * 2) / 365;
	$: versicherungProJahr = 4 * wohnflaeche;
	$: internetProJahr = 480;
	$: heizungProJahr = (1.26 * 12 * wohnflaeche * (availability + 1)) / 2;
	$: stromProJahr = (0.75 * 12 * wohnflaeche * (availability + 1)) / 2;

	// Loan calculations
	$: kreditbetrag = kaufpreis - eigenkapital;
	$: zinssatz = 0.035;

	// Income calculations
	$: tageVermietet = 365 * belegungsrate;
	$: buchungenProJahr = (tageVermietet * availability) / buchungsdauer;
	$: reinigungskostenProJahr = reinigungskosten * buchungenProJahr;
	$: jahreseinnahmen = tageVermietet * mietpreis;

	// Format numbers to German locale
	const formatNumber = (num: number) => {
		return new Intl.NumberFormat('de-DE').format(num);
	};

	// Calculate annuity
	function calculateAnnuity(rate: number, periods: number, presentValue: number) {
		const monthlyRate = rate / 12;
		const factor = Math.pow(1 + monthlyRate, periods);
		return (presentValue * monthlyRate * factor) / (factor - 1);
	}

	// Costs and ROI calculations
	$: jahreskosten =
		instandhaltungKosten +
		reinigungskostenProJahr +
		versicherungProJahr +
		internetProJahr +
		heizungProJahr +
		stromProJahr;
	$: kreditrate = calculateAnnuity(zinssatz, 20 * 12, kreditbetrag);
	$: cashflow = jahreseinnahmen * (1 - provision) - jahreskosten - kreditrate * 12;
	$: roi = (cashflow / eigenkapital) * 100;

	// ROI feedback
	$: feedback = (() => {
		if (roi <= 4) {
			return {
				text: 'Das Investment lohnt sich wahrscheinlich nicht. In besonderen Lagen kann sich der Kauf dennoch rechnen.',
				color: 'bg-error/20'
			};
		} else if (roi > 4 && roi <= 6) {
			return {
				text: 'Es könnte gut sein dass sich das Investment lohnt. Eine genauere Berechnung lohnt sich.',
				color: 'bg-warning/20'
			};
		} else {
			return {
				text: 'Das Investment scheint sich zu lohnen. Du solltest es definitiv in Betracht ziehen.',
				color: 'bg-success/20'
			};
		}
	})();
</script>

<main class="container mx-auto px-4 py-6 md:py-8">
	<div class="mx-auto max-w-2xl">
		<article class="card bg-base-100 shadow-xl">
			<form class="card-body p-4 sm:p-6 md:p-8" on:submit|preventDefault>
				<header>
					<h1 class="card-title mb-2 text-xl md:text-2xl">Schnellrechner</h1>
					<p class="mb-4 text-sm text-base-content/70 md:text-base">
						Berechne in wenigen Sekunden die Eigenkapitalrendite deiner Ferienimmobilie
					</p>
				</header>

				<div class="alert mb-6 p-4 shadow-lg {feedback.color} rounded-lg" role="alert">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 flex-shrink-0"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" y1="8" x2="12" y2="12" />
						<line x1="12" y1="16" x2="12.01" y2="16" />
					</svg>
					<div class="space-y-1">
						<h3 class="text-lg font-bold">
							Eigenkapitalrendite: {formatNumber(Number(roi.toFixed(1)))}%
						</h3>
						<div class="text-sm">{feedback.text}</div>
					</div>
				</div>

				<div class="my-6 space-y-6 md:space-y-8">
					<div class="form-control w-full">
						<label class="w-full">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-sm font-medium">Kaufpreis</span>
								<div class="badge badge-neutral font-medium">{formatNumber(kaufpreis)} €</div>
							</div>
							<input
								type="range"
								min={100000}
								max={1000000}
								step={10000}
								bind:value={kaufpreis}
								class="range range-primary"
								aria-label="Kaufpreis"
							/>
						</label>
					</div>

					<div class="form-control w-full">
						<label class="w-full">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-sm font-medium">Eigenkapital</span>
								<div class="badge badge-neutral font-medium">{formatNumber(eigenkapital)} €</div>
							</div>
							<input
								type="range"
								min={20000}
								max={1000000}
								step={10000}
								bind:value={eigenkapital}
								class="range range-primary"
								aria-label="Eigenkapital"
							/>
						</label>
					</div>

					<div class="form-control w-full">
						<label class="w-full">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-sm font-medium">Mietpreis pro Nacht</span>
								<div class="badge badge-neutral font-medium">{formatNumber(mietpreis)} €</div>
							</div>
							<input
								type="range"
								min={50}
								max={500}
								step={5}
								bind:value={mietpreis}
								class="range range-primary"
								aria-label="Mietpreis pro Nacht"
							/>
						</label>
					</div>

					<div class="form-control w-full">
						<label class="w-full">
							<div class="mb-2 flex items-center justify-between">
								<span class="text-sm font-medium">Wohnfläche</span>
								<div class="badge badge-neutral font-medium">{formatNumber(wohnflaeche)} m²</div>
							</div>
							<input
								type="range"
								min={40}
								max={200}
								step={5}
								bind:value={wohnflaeche}
								class="range range-primary"
								aria-label="Wohnfläche"
							/>
						</label>
					</div>
				</div>
			</form>
		</article>
	</div>
</main>
