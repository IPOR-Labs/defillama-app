import Layout from '~/layout'
import yamlApiSpec from '~/docs/resolvedSpec.json'
import { useEffect } from 'react'
import 'swagger-ui/dist/swagger-ui.css'
import Head from 'next/head'
import { useIsClient } from '~/hooks'
import { useRouter } from 'next/router'

export function ApiDocs({ spec = yamlApiSpec }: { spec: any }) {
	const router = useRouter()
	const isClient = useIsClient()
	if (!isClient) return null

	const downloadSpec = () => {
		const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(spec, null, 2))
		const downloadAnchorNode = document.createElement('a')
		downloadAnchorNode.setAttribute('href', dataStr)
		downloadAnchorNode.setAttribute('download', 'defillama-api-spec.json')
		document.body.appendChild(downloadAnchorNode)
		downloadAnchorNode.click()
		downloadAnchorNode.remove()
	}

	return (
		<>
			{router.pathname === '/docs/api' ? (
				<div className="relative p-3 text-sm text-black dark:text-white text-center rounded-md bg-[hsl(215deg_79%_51%_/_12%)]">
					<div className="flex flex-col items-center">
						<div className="flex flex-col items-start gap-4">
							<p>
								Need more from the DefiLlama API? Our <b>Pro API</b> gives you:
							</p>

							<ul className="list-disc list-inside flex flex-col items-start gap-2">
								<li>Access to all data – including raises, unlocks, active users, and more.</li>
								<li>Higher rate limits – handle more requests.</li>
								<li>Priority support – get help when you need it.</li>
							</ul>

							<p>
								Upgrade here:{' '}
								<a href="https://defillama.com/subscription" className="underline">
									https://defillama.com/subscription
								</a>
							</p>

							<p>
								Full <b>Pro API</b> documentation here:{' '}
								<a href="https://defillama.com/pro-api/docs" className="underline">
									https://defillama.com/pro-api/docs
								</a>
							</p>
						</div>
					</div>
				</div>
			) : null}
			<div className="flex justify-end w-full">
				<button
					onClick={downloadSpec}
					className="px-4 py-2 bg-[#2172E5] hover:bg-[#4285f4] text-white rounded-md transition-colors"
				>
					Download API Spec
				</button>
			</div>
			<Swagger spec={spec} />
		</>
	)
}

function Swagger({ spec }) {
	useEffect(() => {
		async function init() {
			const { default: SwaggerUI } = await import('swagger-ui')
			SwaggerUI({
				dom_id: '#swagger',
				defaultModelsExpandDepth: -1,
				spec: spec,
				syntaxHighlight: {
					activated: false,
					theme: 'agate'
				},
				requestInterceptor: (request) => {
					request.url = request.url.replace(/%3A/g, ':').replace(/%2C/g, ',')
					return request
				}
			})
		}

		init()
	}, [])

	return <div id="swagger" />
}

export default function ApiDocsPage() {
	return (
		<Layout title="DefiLlama API Docs">
			<Head>
				<link rel="stylesheet" type="text/css" href="/swagger-dark.css" />
			</Head>
			<ApiDocs spec={yamlApiSpec} />
		</Layout>
	)
}
