import "./App.css";

const App = () => {
	return (
		<div className="bg-white text-black p-5 mx-auto  max-">
			<div className="text-start mb-2 text-4xl ">
				<h1 className="md:flex">
					<span>jefferson</span> <b className="md:ml-2 block md:inline">ding</b>
				</h1>
			</div>
			<div className="flex flex-col lg:flex-row gap-5 ">
				<div className="">
					<h2 className="wrap-break-words">
						<b>me</b> AT <b>jdi</b> DOT <b>ng</b>
					</h2>

					<div className="my-4">
						<h2 className="text-2xl font-bold">links</h2>
						<ul>
							<li className="wrap-break-words">
								<a href="https://github.com/jeofo">github</a>
							</li>
							<li className="wrap-break-words">
								<a href="https://linkedin.com/in/dingjefferson">linkedin</a>
							</li>
							<li className="wrap-break-words">
								<a href="https://jeofo.substack.com/">substack</a>
							</li>
							<li className="wrap-break-words">
								<a href="https://councils.forbes.com/profile/Jefferson-Ding-Chief-Product-Officer-Clado-AI/5a86013a-f8a3-4c5e-887a-edc9f498a48e">
									forbes
								</a>
							</li>
						</ul>
					</div>

					<div className="my-4">
						<ul>
							<li className="wrap-break-words">
								b.s.e in computer engineering <b>@</b> university of
								pennsylvania
							</li>
							<li className="wrap-break-words">
								b.s in economics, conc. finance <b>@</b> wharton
							</li>
						</ul>
					</div>

					<div className="my-4">
						<h2 className="text-2xl font-bold">prev</h2>
						<ul>
							<li className="wrap-break-words">
								asic firmware <b>@</b> google
							</li>
							<li className="wrap-break-words">
								product <b>@</b> clado.ai
							</li>
							<li className="wrap-break-words">
								founder <b>@</b> jaimy.ai, aqc. by clado.ai
							</li>
							<li className="wrap-break-words">
								backend <b>@</b> shades.news
							</li>
							<li className="wrap-break-words">
								software <b>@</b> penn labs
							</li>
							<li className="wrap-break-words">
								software <b>@</b> datagrade
							</li>
							<li className="wrap-break-words">
								cybersecurity <b>@</b> mydware inc.
							</li>
						</ul>
					</div>

					<div className="my-4">
						<h2 className="text-2xl font-bold">contact</h2>
						<div className="bg-gray-100 w-full p-4 mt-2 rounded font-mono text-xs whitespace-pre-wrap overflow-x-auto wrap-break-words max-w-fit">
							{`-----BEGIN PGP PUBLIC KEY BLOCK-----
mDMEZ66uqRYJKwYBBAHaRw8BAQdA3rO6UOG2a5pUXD4rc5/48R26YpcMsXKyZD4N
vRwHqRu0J0plZmZlcnNvbiBEaW5nIDxtYWlsQGplZmZlcnNvbmRpbmcuY29tPoiW
BBMWCgA+AhsDBQsJCAcCAiICBhUKCQgLAgQWAgMBAh4HAheAFiEEDNRUlE2WXPfA
zY3SbWq5hD6AzaMFAmeurxcCGQEACgkQbWq5hD6AzaM82wD6A/cHzEWao3h1GXya
OMBODr3ZmTNIc5TXCj7mpsmuKuYBAIu45+hMQGC1+WKggWejPbO3avJWe1QbNJes
m9vgE9sAtCVKZWZmZXJzb24gRGluZyA8dHlkaW5nMjAwNEBnbWFpbC5jb20+iJAE
ExYIADgWIQQM1FSUTZZc98DNjdJtarmEPoDNowUCZ66vFwIbAwULCQgHAgYVCgkI
CwIEFgIDAQIeAQIXgAAKCRBtarmEPoDNo//GAP9TvWhuVB4xvRsHI9eV+fiPtRjf
M0xgwGSTZOqHOnmQbwD8DZqyPAIZE0DLHMIi9MMEfLjxhsS2phoFR8kmJCgXJQO0
J0plZmZlcnNvbiBEaW5nIDx0eWRpbmcyMDA0QG91dGxvb2suY29tPoiQBBMWCAA4
FiEEDNRUlE2WXPfAzY3SbWq5hD6AzaMFAmeuryICGwMFCwkIBwIGFQoJCAsCBBYC
AwECHgECF4AACgkQbWq5hD6AzaOUbAD/ct2Gx2FcXnw+azknXmE0ZAtBcdF5bzux
05tJZTCsvZEA+wai4I2tBBy1+Ja1d6utrUQK6j4M7cw3uBsTWPEd2gQBuDgEZ66u
qRIKKwYBBAGXVQEFAQEHQPus6EaeW/xJ9ES+I75+eiGZ4HsAwLZzjW+irN49yvc2
AwEIB4h4BBgWCgAgFiEEDNRUlE2WXPfAzY3SbWq5hD6AzaMFAmeurqkCGwwACgkQ
bWq5hD6AzaO3FQEA4trMy8SLo8JyRACY59advi0lF2275xg+fTRle4EOI9QA/1bq
/KuULZ7oHkaU8DP1Z7eVYSzHT6t3paLU9qd80/oM
=M15y
-----END PGP PUBLIC KEY BLOCK-----`}
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div className="border-t border-black mt-10 pt-5 text-center">
				<p className="wrap-break-words">
					© {new Date().getFullYear()} jefferson ding. all rights reserved.
				</p>
				<p className="text-xs text-center wrap-break-words">
					last updated: {new Date(1750505370000).toLocaleDateString()}
				</p>
			</div>
		</div>
	);
};

export default App;
